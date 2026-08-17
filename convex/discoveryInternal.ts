import { v } from "convex/values";

import { internalMutation } from "./_generated/server";

export const _startRun = internalMutation({
  args: {
    triggeredBy: v.string(),
    keywordCount: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("discoveryRuns", {
      triggeredBy: args.triggeredBy,
      keywordCount: args.keywordCount,
      channelsFound: 0,
      newChannels: 0,
      status: "running",
      startedAt: Date.now(),
    });
  },
});

export const _commitChannels = internalMutation({
  args: {
    runId: v.id("discoveryRuns"),
    channels: v.array(
      v.object({
        channelId: v.string(),
        subscriberCount: v.number(),
        viewCount: v.number(),
        videoCount: v.number(),
        channelPublishedAt: v.string(),
        title: v.string(),
        description: v.string(),
        customUrl: v.string(),
        thumbnailUrl: v.string(),
        category: v.string(),
        keyword: v.string(),
        channelAgeInMonths: v.optional(v.number()),
        avgViews: v.optional(v.number()),
        estimatedMrr: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    let found = 0;
    let newChannels = 0;
    for (const channel of args.channels) {
      const existing = await ctx.db
        .query("channels")
        .withIndex("by_channelId", (q) => q.eq("channelId", channel.channelId))
        .unique();
      found++;
      if (existing) {
        await ctx.db.patch("channels", existing._id, {
          subscriberCount: channel.subscriberCount,
          viewCount: channel.viewCount,
          videoCount: channel.videoCount,
          channelPublishedAt: channel.channelPublishedAt,
          title: channel.title,
          description: channel.description,
          customUrl: channel.customUrl,
          thumbnailUrl: channel.thumbnailUrl,
          category: channel.category,
          keyword: channel.keyword,
          channelAgeInMonths: channel.channelAgeInMonths,
          avgViews: channel.avgViews,
          estimatedMrr: channel.estimatedMrr,
          lastDiscoveredAt: Date.now(),
        });
      } else {
        newChannels++;
        await ctx.db.insert("channels", {
          channelId: channel.channelId,
          title: channel.title,
          description: channel.description,
          thumbnailUrl: channel.thumbnailUrl,
          customUrl: channel.customUrl,
          subscriberCount: channel.subscriberCount,
          videoCount: channel.videoCount,
          viewCount: channel.viewCount,
          channelPublishedAt: channel.channelPublishedAt,
          category: channel.category,
          keyword: channel.keyword,
          status: "pending",
          lastDiscoveredAt: Date.now(),
          channelAgeInMonths: channel.channelAgeInMonths,
          avgViews: channel.avgViews,
          estimatedMrr: channel.estimatedMrr,
        });
      }
    }
    return { found, newChannels };
  },
});

export const _finishRun = internalMutation({
  args: {
    runId: v.id("discoveryRuns"),
    status: v.union(v.literal("completed"), v.literal("failed")),
    channelsFound: v.optional(v.number()),
    newChannels: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch("discoveryRuns", args.runId, {
      status: args.status,
      finishedAt: Date.now(),
      channelsFound: args.channelsFound ?? 0,
      newChannels: args.newChannels ?? 0,
      error: args.error,
    });
  },
});
