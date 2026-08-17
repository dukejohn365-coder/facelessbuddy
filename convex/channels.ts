import { v } from "convex/values";

import { internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getIdentityEmail, isAdmin } from "./admin";

export function channelAgeMonths(publishedAt: string): number {
  const created = new Date(publishedAt);
  if (Number.isNaN(created.getTime())) return 0;
  const ms = Date.now() - created.getTime();
  return Math.max(0, Math.floor(ms / (30.44 * 24 * 60 * 60 * 1000)));
}

export const _getChannelDoc = internalQuery({
  args: {
    docId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const channel = await ctx.db.get("channels", args.docId);
    if (!channel) return null;
    if (
      (channel.channelAgeInMonths === undefined || channel.channelAgeInMonths === null) &&
      channel.channelPublishedAt
    ) {
      return { ...channel, channelAgeInMonths: channelAgeMonths(channel.channelPublishedAt) };
    }
    return channel;
  },
});

export const getChannelByChannelId = query({
  args: {
    channelId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("channels")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.channelId))
      .unique();
  },
});

export const listApprovedChannels = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let channels;
    if (args.category) {
      channels = await ctx.db
        .query("channels")
        .withIndex("by_status_and_category", (q) =>
          q.eq("status", "approved").eq("category", args.category!)
        )
        .take(100);
    } else {
      channels = await ctx.db
        .query("channels")
        .withIndex("by_status", (q) => q.eq("status", "approved"))
        .take(100);
    }

    const sorted = [...channels].sort(
      (a, b) => b.subscriberCount - a.subscriberCount
    );

    return {
      channels: sorted,
      total: sorted.length,
      canViewAll: true,
    };
  },
});

export const listApprovedCategories = query({
  args: {},
  handler: async (ctx) => {
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .take(500);
    const categories = new Set<string>();
    for (const channel of channels) {
      categories.add(channel.category);
    }
    return [...categories].sort();
  },
});

export const listPendingChannels = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    return await ctx.db
      .query("channels")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .take(200);
  },
});

export const listChannelStatusCounts = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    for await (const _doc of ctx.db
      .query("channels")
      .withIndex("by_status", (q) => q.eq("status", "pending"))) {
      pending++;
    }
    for await (const _doc of ctx.db
      .query("channels")
      .withIndex("by_status", (q) => q.eq("status", "approved"))) {
      approved++;
    }
    for await (const _doc of ctx.db
      .query("channels")
      .withIndex("by_status", (q) => q.eq("status", "rejected"))) {
      rejected++;
    }

    return { pending, approved, rejected };
  },
});

export const approveChannel = mutation({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    await ctx.db.patch("channels", args.channelId, {
      status: "approved",
      approvedBy: (await getIdentityEmail(ctx)) ?? undefined,
      approvedAt: Date.now(),
    });

    ctx.scheduler.runAfter(0, internal.outliers._fetchAndStoreChannelOutliers, {
      channelId: args.channelId,
    });
  },
});

export const rejectChannel = mutation({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    await ctx.db.patch("channels", args.channelId, {
      status: "rejected",
      approvedBy: (await getIdentityEmail(ctx)) ?? undefined,
      approvedAt: Date.now(),
    });
  },
});

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) {
      return { approvedChannels: 0, savedChannels: 0, outlierVideos: 0 };
    }

    const approvedChannels = await ctx.db
      .query("channels")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .take(500);

    const savedChannels = await ctx.db
      .query("savedChannels")
      .withIndex("by_userId", (q) => q.eq("userId", identity.email!))
      .take(500);

    let outlierVideos = 0;
    for (const entry of savedChannels) {
      const outliers = await ctx.db
        .query("channelOutliers")
        .withIndex("by_channelId", (q) => q.eq("channelId", entry.channelId))
        .unique();
      if (outliers) {
        outlierVideos += outliers.outliers.length;
      }
    }

    return {
      approvedChannels: approvedChannels.length,
      savedChannels: savedChannels.length,
      outlierVideos,
    };
  },
});
