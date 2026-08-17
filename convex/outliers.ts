import { action, env, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

type SearchItem = {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

type VideoItem = {
  id?: string;
  snippet?: {
    title?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
};

type OutlierVideo = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  multiplier: number;
};

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API ${response.status}: ${body.slice(0, 500)}`);
  }
  return await response.json();
}

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return String(views);
}

export const _storeChannelOutliers = internalMutation({
  args: {
    channelId: v.id("channels"),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
    avgViews: v.number(),
    outlierThreshold: v.number(),
    outliers: v.array(
      v.object({
        videoId: v.string(),
        title: v.string(),
        thumbnailUrl: v.string(),
        publishedAt: v.string(),
        views: v.number(),
        likes: v.number(),
        comments: v.number(),
        multiplier: v.number(),
      })
    ),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("channelOutliers")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.channelId))
      .unique();

    const topOutlier = args.outliers.length > 0
      ? {
          videoId: args.outliers[0]!.videoId,
          title: args.outliers[0]!.title,
          thumbnailUrl: args.outliers[0]!.thumbnailUrl,
          views: args.outliers[0]!.views,
          multiplier: args.outliers[0]!.multiplier,
        }
      : undefined;

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        avgViews: args.avgViews,
        outlierThreshold: args.outlierThreshold,
        outliers: args.outliers,
        message: args.message,
        fetchedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("channelOutliers", {
        channelId: args.channelId,
        status: args.status,
        avgViews: args.avgViews,
        outlierThreshold: args.outlierThreshold,
        outliers: args.outliers,
        message: args.message,
        fetchedAt: Date.now(),
      });
    }

    await ctx.db.patch("channels", args.channelId, {
      topOutlierVideo: topOutlier,
    });
  },
});

export const _fetchAndStoreChannelOutliers = internalAction({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args): Promise<void> => {
    const apiKey = env.YOUTUBE_API_KEY;
    if (!apiKey) return;

    const channel = await ctx.runQuery(
      internal.channels._getChannelDoc,
      { docId: args.channelId }
    );
    if (!channel) return;

    const avgViews =
      channel.videoCount > 0
        ? Math.round(channel.viewCount / channel.videoCount)
        : 0;

    if (avgViews === 0) {
      await ctx.runMutation(internal.outliers._storeChannelOutliers, {
        channelId: args.channelId,
        status: "completed",
        avgViews: 0,
        outlierThreshold: 0,
        outliers: [],
        message: "Channel has no view data to analyze",
      });
      return;
    }

    try {
      const searchParams = new URLSearchParams({
        part: "snippet",
        channelId: channel.channelId,
        order: "viewCount",
        maxResults: "50",
        type: "video",
        key: apiKey,
      });

      const searchData = (await fetchJson(
        `${YOUTUBE_SEARCH_URL}?${searchParams.toString()}`
      )) as { items?: SearchItem[] };

      const videoIds = (searchData.items ?? [])
        .map((item) => item.id?.videoId)
        .filter((id): id is string => Boolean(id));

      if (videoIds.length === 0) {
        await ctx.runMutation(internal.outliers._storeChannelOutliers, {
          channelId: args.channelId,
          status: "completed",
          avgViews,
          outlierThreshold: avgViews * 2,
          outliers: [],
          message: "No videos found for this channel",
        });
        return;
      }

      const videosParams = new URLSearchParams({
        part: "snippet,statistics",
        id: videoIds.join(","),
        key: apiKey,
      });

      const videosData = (await fetchJson(
        `${YOUTUBE_VIDEOS_URL}?${videosParams.toString()}`
      )) as { items?: VideoItem[] };

      const outlierThreshold = avgViews * 2;
      const cutoffDate = Date.now() - 140 * 24 * 60 * 60 * 1000;

      const outliers = (videosData.items ?? [])
        .map((video) => {
          const views = Number(video.statistics?.viewCount ?? 0);
          const likes = Number(video.statistics?.likeCount ?? 0);
          const comments = Number(video.statistics?.commentCount ?? 0);
          const multiplier = avgViews > 0 ? views / avgViews : 0;
          const publishedAt = video.snippet?.publishedAt ?? "";
          const publishedTime = new Date(publishedAt).getTime();

          return {
            videoId: video.id ?? "",
            title: video.snippet?.title ?? "Untitled",
            thumbnailUrl:
              video.snippet?.thumbnails?.high?.url ??
              video.snippet?.thumbnails?.medium?.url ??
              video.snippet?.thumbnails?.default?.url ??
              "",
            publishedAt,
            views,
            likes,
            comments,
            multiplier: Math.round(multiplier * 10) / 10,
            publishedTime,
          };
        })
        .filter((v) => v.views > outlierThreshold && v.publishedTime >= cutoffDate)
        .sort((a, b) => b.views - a.views)
        .map(({ publishedTime: _published, ...rest }) => rest);

      const message =
        outliers.length > 0
          ? `Found ${outliers.length} outlier${outliers.length === 1 ? "" : "s"} (>${formatViews(outlierThreshold)} views, last 140 days)`
          : `No outliers found (threshold: ${formatViews(outlierThreshold)} views, last 140 days)`;

      await ctx.runMutation(internal.outliers._storeChannelOutliers, {
        channelId: args.channelId,
        status: "completed",
        avgViews,
        outlierThreshold,
        outliers,
        message,
      });
    } catch {
      await ctx.runMutation(internal.outliers._storeChannelOutliers, {
        channelId: args.channelId,
        status: "failed",
        avgViews,
        outlierThreshold: avgViews * 2,
        outliers: [],
        message: "Failed to fetch outlier data",
      });
    }
  },
});

export const _fetchAndStoreOutliers = internalAction({
  args: {
    userId: v.string(),
    channelId: v.id("channels"),
  },
  handler: async (ctx, args): Promise<void> => {
    const existing = await ctx.runQuery(
      internal.outliers._getChannelOutliers,
      { channelId: args.channelId }
    );

    if (existing && existing.status === "completed") {
      return;
    }

    await ctx.runAction(
      internal.outliers._fetchAndStoreChannelOutliers,
      { channelId: args.channelId }
    );
  },
});

export const _getChannelOutliers = internalQuery({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("channelOutliers")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.channelId))
      .unique();
  },
});

export const listOutlierResults = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return [];

    const saved = await ctx.db
      .query("savedChannels")
      .withIndex("by_userId", (q) => q.eq("userId", identity.email!))
      .take(200);

    const results = [];
    for (const entry of saved) {
      const channel = await ctx.db.get("channels", entry.channelId);
      if (!channel) continue;

      const outliers = await ctx.db
        .query("channelOutliers")
        .withIndex("by_channelId", (q) => q.eq("channelId", entry.channelId))
        .unique();

      if (outliers) {
        results.push({ ...outliers, channel });
      }
    }

    return results;
  },
});

export const findOutliers = action({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args): Promise<{
    channel: { title: string; avgViews: number; subscriberCount: number };
    outliers: OutlierVideo[];
    message: string;
  }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    const channel = await ctx.runQuery(
      internal.channels._getChannelDoc,
      { docId: args.channelId }
    );
    if (!channel) throw new Error("Channel not found");

    const existing: {
      avgViews: number;
      outliers: OutlierVideo[];
      message?: string;
    } | null = await ctx.runQuery(
      internal.outliers._getChannelOutliers,
      { channelId: args.channelId }
    );

    if (existing && existing.outliers !== undefined) {
      return {
        channel: {
          title: channel.title,
          avgViews: existing.avgViews,
          subscriberCount: channel.subscriberCount,
        },
        outliers: existing.outliers,
        message: existing.message ?? "",
      };
    }

    await ctx.runAction(
      internal.outliers._fetchAndStoreChannelOutliers,
      { channelId: args.channelId }
    );

    const updated: {
      avgViews: number;
      outliers: OutlierVideo[];
      message?: string;
    } | null = await ctx.runQuery(
      internal.outliers._getChannelOutliers,
      { channelId: args.channelId }
    );

    return {
      channel: {
        title: channel.title,
        avgViews: updated?.avgViews ?? 0,
        subscriberCount: channel.subscriberCount,
      },
      outliers: updated?.outliers ?? [],
      message: updated?.message ?? "Outlier detection completed",
    };
  },
});

export const getOutlierPreference = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return null;

    const pref = await ctx.db
      .query("outlierPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", identity.email!))
      .unique();

    return pref?.scope ?? "saved_only";
  },
});

export const setOutlierPreference = mutation({
  args: {
    scope: v.union(
      v.literal("saved_only"),
      v.literal("similar"),
      v.literal("all")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("outlierPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", identity.email!))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { scope: args.scope });
    } else {
      await ctx.db.insert("outlierPreferences", {
        userId: identity.email!,
        scope: args.scope,
      });
    }
  },
});

export const listAllOutlierResults = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return [];

    const pref = await ctx.db
      .query("outlierPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", identity.email!))
      .unique();

    const scope = pref?.scope ?? "saved_only";

    if (scope === "all") {
      const results = await ctx.db
        .query("channelOutliers")
        .order("desc")
        .take(100);

      const enriched = [];
      for (const result of results) {
        const channel = await ctx.db.get("channels", result.channelId);
        if (channel) {
          enriched.push({ ...result, channel });
        }
      }
      return enriched;
    }

    if (scope === "saved_only") {
      const saved = await ctx.db
        .query("savedChannels")
        .withIndex("by_userId", (q) => q.eq("userId", identity.email!))
        .take(200);

      const results = [];
      for (const entry of saved) {
        const channel = await ctx.db.get("channels", entry.channelId);
        if (!channel) continue;

        const outliers = await ctx.db
          .query("channelOutliers")
          .withIndex("by_channelId", (q) => q.eq("channelId", entry.channelId))
          .unique();

        if (outliers) {
          results.push({ ...outliers, channel });
        }
      }
      return results;
    }

    const saved = await ctx.db
      .query("savedChannels")
      .withIndex("by_userId", (q) => q.eq("userId", identity.email!))
      .take(200);

    const savedChannelIds = new Set(saved.map((s) => s.channelId));
    const savedCategories = new Set<string>();
    for (const entry of saved) {
      const ch = await ctx.db.get("channels", entry.channelId);
      if (ch) savedCategories.add(ch.category);
    }

    const results = [];
    const allOutliers = await ctx.db
      .query("channelOutliers")
      .order("desc")
      .take(200);

    for (const outlier of allOutliers) {
      if (savedChannelIds.has(outlier.channelId)) continue;
      const channel = await ctx.db.get("channels", outlier.channelId);
      if (!channel) continue;
      if (savedCategories.has(channel.category)) {
        results.push({ ...outlier, channel });
      }
    }

    return results;
  },
});
