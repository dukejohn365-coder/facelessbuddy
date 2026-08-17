import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  keywords: defineTable({
    keyword: v.string(),
    category: v.string(),
    active: v.boolean(),
    addedBy: v.optional(v.string()),
  }).index("by_category", ["category"]),

  channels: defineTable({
    channelId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    customUrl: v.optional(v.string()),
    subscriberCount: v.number(),
    videoCount: v.number(),
    viewCount: v.number(),
    channelPublishedAt: v.optional(v.string()),
    category: v.string(),
    keyword: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    lastDiscoveredAt: v.number(),
    channelAgeInMonths: v.optional(v.number()),
    avgViews: v.optional(v.number()),
    estimatedMrr: v.optional(v.number()),
    topOutlierVideo: v.optional(
      v.object({
        videoId: v.string(),
        title: v.string(),
        thumbnailUrl: v.string(),
        views: v.number(),
        multiplier: v.number(),
      })
    ),
  })
    .index("by_channelId", ["channelId"])
    .index("by_status", ["status"])
    .index("by_status_and_category", ["status", "category"]),

  admins: defineTable({
    email: v.string(),
    addedBy: v.optional(v.string()),
  }).index("by_email", ["email"]),

  savedChannels: defineTable({
    userId: v.string(),
    channelId: v.id("channels"),
    savedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_channelId", ["userId", "channelId"]),

  competitors: defineTable({
    userId: v.string(),
    channelId: v.id("channels"),
    addedAt: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_channelId", ["userId", "channelId"]),

  channelOutliers: defineTable({
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
    fetchedAt: v.number(),
  }).index("by_channelId", ["channelId"]),

  outlierPreferences: defineTable({
    userId: v.string(),
    scope: v.union(
      v.literal("saved_only"),
      v.literal("similar"),
      v.literal("all")
    ),
  }).index("by_userId", ["userId"]),

  discoveryRuns: defineTable({
    triggeredBy: v.string(),
    keywordCount: v.number(),
    channelsFound: v.number(),
    newChannels: v.number(),
    status: v.union(v.literal("running"), v.literal("completed"), v.literal("failed")),
    startedAt: v.number(),
    finishedAt: v.optional(v.number()),
    error: v.optional(v.string()),
  }),
});
