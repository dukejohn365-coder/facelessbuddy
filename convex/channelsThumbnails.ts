import { v } from "convex/values";

import { internalMutation, internalQuery } from "./_generated/server";

export const _listChannelsWithoutThumbnails = internalQuery({
  args: {},
  handler: async (ctx) => {
    const channels = await ctx.db.query("channels").take(500);
    return channels.filter(
      (c) => !c.thumbnailUrl || c.thumbnailUrl.trim() === ""
    );
  },
});

export const _updateThumbnailUrl = internalMutation({
  args: {
    channelId: v.id("channels"),
    thumbnailUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.channelId, {
      thumbnailUrl: args.thumbnailUrl,
    });
  },
});
