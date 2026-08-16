import { v } from "convex/values";

import { action, env, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getIdentityEmail } from "./admin";

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

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

type VideoItem = {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
};

function extractWordFrequency(titles: string[]): { word: string; count: number }[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "it", "this", "that", "are", "was",
    "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
    "will", "would", "could", "should", "may", "might", "shall", "can",
    "not", "no", "nor", "so", "if", "then", "than", "too", "very",
    "just", "about", "up", "out", "all", "its", "my", "your", "his",
    "her", "our", "their", "what", "which", "who", "whom", "how", "when",
    "where", "why", "i", "you", "he", "she", "we", "they", "me", "him",
    "us", "them", "myself", "yourself", "himself", "herself", "itself",
    "ourselves", "yourselves", "themselves", "am", "as", "into", "through",
    "during", "before", "after", "above", "below", "between", "under",
    "again", "further", "once", "here", "there", "all", "each", "every",
    "both", "few", "more", "most", "other", "some", "such", "only", "own",
    "same", "also", "over", "because", "until", "while", "these", "those",
  ]);

  const wordCounts = new Map<string, number>();
  for (const title of titles) {
    const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
    for (const word of words) {
      if (word.length > 2 && !stopWords.has(word)) {
        wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);
      }
    }
  }
  return [...wordCounts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

function extractBigrams(titles: string[]): { phrase: string; count: number }[] {
  const phraseCounts = new Map<string, number>();
  for (const title of titles) {
    const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      phraseCounts.set(phrase, (phraseCounts.get(phrase) ?? 0) + 1);
    }
  }
  return [...phraseCounts.entries()]
    .map(([phrase, count]) => ({ phrase, count }))
    .filter((p) => p.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
}

function calculateUploadFrequency(videos: { publishedAt: string }[]): string {
  if (videos.length < 2) return "Insufficient data";
  const timestamps = videos
    .map((v) => new Date(v.publishedAt).getTime())
    .filter((t) => !Number.isNaN(t))
    .sort((a, b) => b - a);
  if (timestamps.length < 2) return "Insufficient data";
  const spanDays = (timestamps[0]! - timestamps[timestamps.length - 1]!) / (24 * 60 * 60 * 1000);
  if (spanDays <= 0) return "Insufficient data";
  const videosPerWeek = (timestamps.length / spanDays) * 7;
  if (videosPerWeek >= 5) return `${Math.round(videosPerWeek)} videos/week`;
  if (videosPerWeek >= 1) return `${videosPerWeek.toFixed(1)} videos/week`;
  const videosPerMonth = (timestamps.length / spanDays) * 30;
  return `${videosPerMonth.toFixed(1)} videos/month`;
}

function calculateViewTrend(videos: { views: number; publishedAt: string }[]): "growing" | "stable" | "declining" {
  if (videos.length < 4) return "stable";
  const sorted = [...videos].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );
  const midpoint = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, midpoint);
  const secondHalf = sorted.slice(midpoint);
  const avgFirst = firstHalf.reduce((sum, v) => sum + v.views, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, v) => sum + v.views, 0) / secondHalf.length;
  const change = (avgSecond - avgFirst) / (avgFirst || 1);
  if (change > 0.15) return "growing";
  if (change < -0.15) return "declining";
  return "stable";
}

type AnalysisResult = {
  channel: {
    title: string;
    subscriberCount: number;
    avgViews: number;
    videoCount: number;
  };
  titlePatterns: {
    words: { word: string; count: number }[];
    bigrams: { phrase: string; count: number }[];
  };
  uploadFrequency: string;
  viewTrend: "growing" | "stable" | "declining";
  topVideos: {
    videoId: string;
    title: string;
    views: number;
    likes: number;
    publishedAt: string;
  }[];
};

export const analyzeCompetitor = action({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args): Promise<AnalysisResult> => {
    const apiKey = env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("YOUTUBE_API_KEY is not set");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    const channel = await ctx.runQuery(
      internal.channels._getChannelDoc,
      { docId: args.channelId }
    );
    if (!channel) throw new Error("Channel not found");

    const searchParams = new URLSearchParams({
      part: "snippet",
      channelId: channel.channelId,
      order: "date",
      maxResults: "50",
      type: "video",
      key: apiKey,
    });

    const searchData = (await fetchJson(
      `${YOUTUBE_SEARCH_URL}?${searchParams.toString()}`
    )) as { items?: { id?: { videoId?: string }; snippet?: { title?: string; publishedAt?: string } }[] };

    const videoIds = (searchData.items ?? [])
      .map((item) => item.id?.videoId)
      .filter((id): id is string => Boolean(id));

    if (videoIds.length === 0) {
      return {
        channel: {
          title: channel.title,
          subscriberCount: channel.subscriberCount,
          avgViews: channel.avgViews ?? 0,
          videoCount: channel.videoCount,
        },
        titlePatterns: { words: [], bigrams: [] },
        uploadFrequency: "No videos found",
        viewTrend: "stable" as const,
        topVideos: [],
      };
    }

    const videosParams = new URLSearchParams({
      part: "snippet,statistics",
      id: videoIds.join(","),
      key: apiKey,
    });

    const videosData = (await fetchJson(
      `${YOUTUBE_VIDEOS_URL}?${videosParams.toString()}`
    )) as { items?: VideoItem[] };

    const videos = (videosData.items ?? []).map((v) => ({
      videoId: v.id ?? "",
      title: v.snippet?.title ?? "",
      description: v.snippet?.description ?? "",
      publishedAt: v.snippet?.publishedAt ?? "",
      views: Number(v.statistics?.viewCount ?? 0),
      likes: Number(v.statistics?.likeCount ?? 0),
      comments: Number(v.statistics?.commentCount ?? 0),
    }));

    const titles = videos.map((v) => v.title);
    const words = extractWordFrequency(titles);
    const bigrams = extractBigrams(titles);
    const uploadFrequency = calculateUploadFrequency(videos);
    const viewTrend = calculateViewTrend(videos);

    const topVideos = videos
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((v) => ({
        videoId: v.videoId,
        title: v.title,
        views: v.views,
        likes: v.likes,
        publishedAt: v.publishedAt,
      }));

    return {
      channel: {
        title: channel.title,
        subscriberCount: channel.subscriberCount,
        avgViews: channel.avgViews ?? 0,
        videoCount: channel.videoCount,
      },
      titlePatterns: { words, bigrams },
      uploadFrequency,
      viewTrend,
      topVideos,
    };
  },
});

export const _isChannelCompetitor = internalQuery({
  args: {
    userId: v.string(),
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("competitors")
      .withIndex("by_userId_and_channelId", (q) =>
        q.eq("userId", args.userId).eq("channelId", args.channelId)
      )
      .unique();
    return existing !== null;
  },
});

export const toggleCompetitor = mutation({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const email = await getIdentityEmail(ctx);
    if (!email) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("competitors")
      .withIndex("by_userId_and_channelId", (q) =>
        q.eq("userId", email).eq("channelId", args.channelId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete("competitors", existing._id);
      return { added: false };
    }

    await ctx.db.insert("competitors", {
      userId: email,
      channelId: args.channelId,
      addedAt: Date.now(),
    });
    return { added: true };
  },
});

export const isChannelCompetitor = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return false;

    const existing = await ctx.db
      .query("competitors")
      .withIndex("by_userId_and_channelId", (q) =>
        q.eq("userId", identity.email!).eq("channelId", args.channelId)
      )
      .unique();

    return existing !== null;
  },
});

export const listCompetitors = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return [];

    const competitors = await ctx.db
      .query("competitors")
      .withIndex("by_userId", (q) => q.eq("userId", identity.email!))
      .order("desc")
      .take(200);

    const results = [];
    for (const entry of competitors) {
      const channel = await ctx.db.get("channels", entry.channelId);
      if (channel) {
        results.push({ ...entry, channel });
      }
    }

    return results;
  },
});
