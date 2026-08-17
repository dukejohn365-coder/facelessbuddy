import { v } from "convex/values";

import { internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getIdentityEmail } from "./admin";

export const _isChannelSaved = internalQuery({
  args: {
    userId: v.string(),
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("savedChannels")
      .withIndex("by_userId_and_channelId", (q) =>
        q.eq("userId", args.userId).eq("channelId", args.channelId)
      )
      .unique();
    return existing !== null;
  },
});

export const toggleSave = mutation({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const email = await getIdentityEmail(ctx);
    if (!email) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("savedChannels")
      .withIndex("by_userId_and_channelId", (q) =>
        q.eq("userId", email).eq("channelId", args.channelId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete("savedChannels", existing._id);
      return { saved: false };
    }

    await ctx.db.insert("savedChannels", {
      userId: email,
      channelId: args.channelId,
      savedAt: Date.now(),
    });

    ctx.scheduler.runAfter(0, internal.outliers._fetchAndStoreOutliers, {
      userId: email,
      channelId: args.channelId,
    });

    return { saved: true };
  },
});

export const isChannelSaved = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const email = await getIdentityEmail(ctx);
    if (!email) return false;

    const existing = await ctx.db
      .query("savedChannels")
      .withIndex("by_userId_and_channelId", (q) =>
        q.eq("userId", email).eq("channelId", args.channelId)
      )
      .unique();

    return existing !== null;
  },
});

export const listSaved = query({
  args: {},
  handler: async (ctx) => {
    const email = await getIdentityEmail(ctx);
    if (!email) return [];

    const saved = await ctx.db
      .query("savedChannels")
      .withIndex("by_userId", (q) => q.eq("userId", email))
      .order("desc")
      .take(200);

    const results = [];
    for (const entry of saved) {
      const channel = await ctx.db.get("channels", entry.channelId);
      if (channel) {
        results.push({ ...entry, channel });
      }
    }

    return results;
  },
});
