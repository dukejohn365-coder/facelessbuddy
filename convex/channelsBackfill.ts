import { action, env } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const YOUTUBE_CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";

type ChannelApiResponse = {
  id?: string;
  snippet?: {
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

type ChannelWithoutThumb = {
  _id: Id<"channels">;
  channelId: string;
  thumbnailUrl?: string;
};

export const backfillThumbnails = action({
  args: {},
  handler: async (ctx): Promise<{ updated: number; total: number; message: string }> => {
    const email: string | null = await ctx.runQuery(
      internal.admin._getIdentityEmail,
      {}
    );
    if (!email) {
      throw new Error("Not authenticated");
    }
    const authed: boolean = await ctx.runQuery(internal.admin._isAdmin, {});
    if (!authed) {
      throw new Error("Not authorized");
    }

    const apiKey = env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error("YOUTUBE_API_KEY is not set");
    }

    const channelsWithoutThumbs: ChannelWithoutThumb[] = await ctx.runQuery(
      internal.channelsThumbnails._listChannelsWithoutThumbnails,
      {}
    );

    if (channelsWithoutThumbs.length === 0) {
      return { updated: 0, total: 0, message: "All channels already have thumbnails" };
    }

    let updated = 0;
    const batchSize = 50;

    for (let i = 0; i < channelsWithoutThumbs.length; i += batchSize) {
      const batch = channelsWithoutThumbs.slice(i, i + batchSize);
      const channelIds = batch.map((c) => c.channelId);

      const params = new URLSearchParams({
        part: "snippet",
        id: channelIds.join(","),
        key: apiKey,
      });

      const url = `${YOUTUBE_CHANNELS_URL}?${params.toString()}`;
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        continue;
      }

      const data = (await response.json()) as { items?: ChannelApiResponse[] };

      for (const item of data.items ?? []) {
        if (!item.id) continue;
        const thumbnailUrl =
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.medium?.url ??
          item.snippet?.thumbnails?.default?.url ??
          "";

        if (thumbnailUrl) {
          const channel = batch.find((c) => c.channelId === item.id);
          if (channel) {
            await ctx.runMutation(
              internal.channelsThumbnails._updateThumbnailUrl,
              {
                channelId: channel._id,
                thumbnailUrl,
              }
            );
            updated++;
          }
        }
      }
    }

    return {
      updated,
      total: channelsWithoutThumbs.length,
      message: `Updated ${updated} of ${channelsWithoutThumbs.length} channels`,
    };
  },
});
