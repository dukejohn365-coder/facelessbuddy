import { action, env, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { isAdmin } from "./admin";
import { channelAgeMonths } from "./channels";
import type { Id } from "./_generated/dataModel";

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";
const YOUTUBE_CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";

type SearchItem = {
  id?: { videoId?: string };
  snippet?: {
    channelId?: string;
    channelTitle?: string;
    description?: string;
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
    channelId?: string;
    channelTitle?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
  statistics?: {
    viewCount?: string;
  };
};

type ChannelItem = {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    customUrl?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
  statistics?: {
    subscriberCount?: string;
    viewCount?: string;
    videoCount?: string;
  };
};

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API ${response.status}: ${body.slice(0, 500)}`);
  }
  return await response.json();
}

async function searchYouTube(
  apiKey: string,
  keyword: string,
  duration: "medium" | "long",
  publishedAfter: string
): Promise<SearchItem[]> {
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    q: keyword,
    maxResults: "50",
    videoDuration: duration,
    videoCaption: "closedCaption",
    relevanceLanguage: "en",
    publishedAfter,
    key: apiKey,
  });
  const url = `${YOUTUBE_SEARCH_URL}?${params.toString()}`;
  const data = (await fetchJson(url)) as { items?: SearchItem[] };
  return data.items ?? [];
}

export const runDiscovery = action({
  args: {},
  handler: async (ctx) => {
    const email: string | null = await ctx.runQuery(internal.admin._getIdentityEmail, {});
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

    const keywords: {
      _id: string;
      keyword: string;
      category: string;
      active: boolean;
      addedBy?: string;
      _creationTime: number;
    }[] = await ctx.runQuery(internal.keywords._listActiveKeywords, {});

    if (keywords.length === 0) {
      throw new Error("No active keywords. Seed keywords or add some first.");
    }

    const runId: Id<"discoveryRuns"> = await ctx.runMutation(internal.discoveryInternal._startRun, {
      triggeredBy: email,
      keywordCount: keywords.length,
    });

    const publishedAfter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    try {
      const searchTasks: Promise<{ keyword: typeof keywords[0]; items: SearchItem[] }>[] = [];
      for (const keyword of keywords) {
        for (const duration of ["medium", "long"] as const) {
          searchTasks.push(
            searchYouTube(apiKey, keyword.keyword, duration, publishedAfter).then((items) => ({
              keyword,
              items,
            }))
          );
        }
      }

      const searchResults = await Promise.all(searchTasks);

      const videoIdToMeta = new Map<string, { category: string; keyword: string }>();
      for (const { keyword, items } of searchResults) {
        for (const item of items) {
          const videoId = item.id?.videoId;
          if (!videoId) continue;
          if (!videoIdToMeta.has(videoId)) {
            videoIdToMeta.set(videoId, {
              category: keyword.category,
              keyword: keyword.keyword,
            });
          }
        }
      }

      const videoIds = [...videoIdToMeta.keys()];

      const channelIdToMeta = new Map<
        string,
        {
          category: string;
          keyword: string;
        }
      >();

      for (let i = 0; i < videoIds.length; i += 50) {
        const batch = videoIds.slice(i, i + 50);
        const params = new URLSearchParams({
          part: "snippet,statistics",
          id: batch.join(","),
          key: apiKey,
        });
        const url = `${YOUTUBE_VIDEOS_URL}?${params.toString()}`;
        const data = (await fetchJson(url)) as { items?: VideoItem[] };
        for (const item of data.items ?? []) {
          const viewCount = Number(item.statistics?.viewCount ?? 0);
          if (viewCount < 5000) continue;
          const channelId = item.snippet?.channelId;
          if (!channelId) continue;
          if (channelIdToMeta.has(channelId)) continue;
          const meta = videoIdToMeta.get(item.id ?? "");
          channelIdToMeta.set(channelId, {
            category: meta?.category ?? "",
            keyword: meta?.keyword ?? "",
          });
        }
      }

      const channelIds = [...channelIdToMeta.keys()];

      const channelsById = new Map<
        string,
        {
          subscriberCount: number;
          viewCount: number;
          videoCount: number;
          channelPublishedAt: string;
          title: string;
          description: string;
          customUrl: string;
          thumbnailUrl: string;
        }
      >();

      for (let i = 0; i < channelIds.length; i += 50) {
        const batch = channelIds.slice(i, i + 50);
        const params = new URLSearchParams({
          part: "snippet,statistics",
          id: batch.join(","),
          key: apiKey,
        });
        const url = `${YOUTUBE_CHANNELS_URL}?${params.toString()}`;
        const data = (await fetchJson(url)) as { items?: ChannelItem[] };
        for (const item of data.items ?? []) {
          const id = item.id;
          if (!id) continue;
          const subscriberCount = Number(item.statistics?.subscriberCount ?? 0);
          if (subscriberCount < 1000) continue;

          channelsById.set(id, {
            subscriberCount,
            viewCount: Number(item.statistics?.viewCount ?? 0),
            videoCount: Number(item.statistics?.videoCount ?? 0),
            channelPublishedAt: item.snippet?.publishedAt ?? "",
            title: item.snippet?.title ?? "",
            description: item.snippet?.description ?? "",
            customUrl: item.snippet?.customUrl ?? "",
            thumbnailUrl:
              item.snippet?.thumbnails?.high?.url ??
              item.snippet?.thumbnails?.medium?.url ??
              item.snippet?.thumbnails?.default?.url ??
              "",
          });
        }
      }

      const upsertResults: {
        found: number;
        newChannels: number;
      } = await ctx.runMutation(internal.discoveryInternal._commitChannels, {
        runId,
        channels: [...channelsById.entries()].map(([channelId, stats]) => {
          const meta = channelIdToMeta.get(channelId)!;
          const avgViews = stats.videoCount > 0 ? Math.round(stats.viewCount / stats.videoCount) : 0;
          const monthlyViews = avgViews * 4;
          const estimatedMrr = Math.round((monthlyViews * 0.012 + monthlyViews * 0.035) / 2);
          return {
            channelId,
            ...stats,
            category: meta.category,
            keyword: meta.keyword,
            channelAgeInMonths: stats.channelPublishedAt ? channelAgeMonths(stats.channelPublishedAt) : undefined,
            avgViews,
            estimatedMrr,
          };
        }),
      });

      await ctx.runMutation(internal.discoveryInternal._finishRun, {
        runId,
        status: "completed",
        channelsFound: upsertResults.found,
        newChannels: upsertResults.newChannels,
      });

      return {
        keywordCount: keywords.length,
        uniqueChannelsFound: upsertResults.found,
        newChannels: upsertResults.newChannels,
      };
    } catch (error) {
      await ctx.runMutation(internal.discoveryInternal._finishRun, {
        runId,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },
});

export const listDiscoveryRuns = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    return await ctx.db.query("discoveryRuns").order("desc").take(20);
  },
});