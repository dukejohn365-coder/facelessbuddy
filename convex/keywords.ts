import { v } from "convex/values";

import { internalQuery, mutation, query } from "./_generated/server";
import { getIdentityEmail, isAdmin } from "./admin";

export const seedCategories: { category: string; keywords: string[] }[] = [
  {
    category: "Personal Finance",
    keywords: [
      "passive income ideas",
      "how to budget money",
      "investing for beginners",
      "financial independence",
      "side hustles that make money",
    ],
  },
  {
    category: "Minimalism",
    keywords: [
      "minimalism explained",
      "declutter your life",
      "minimalist lifestyle",
      "slow living",
      "simple living tips",
    ],
  },
  {
    category: "Meditation & Wellness",
    keywords: [
      "sleep meditation",
      "mindfulness for beginners",
      "guided breathing meditation",
      "stress relief techniques",
      "morning wellness routine",
    ],
  },
  {
    category: "True Crime",
    keywords: [
      "unsolved mysteries",
      "cold cases",
      "true crime documentary",
      "missing persons cases",
      "infamous criminals explained",
    ],
  },
  {
    category: "History & Geography",
    keywords: [
      "ancient history explained",
      "forgotten empires",
      "medieval history documentary",
      "geography facts",
      "world war history",
    ],
  },
  {
    category: "Tech Explained",
    keywords: [
      "how technology works",
      "AI explained simply",
      "gadgets you need",
      "future technology 2026",
      "software explained",
    ],
  },
  {
    category: "Space & Science",
    keywords: [
      "space documentary",
      "how the universe works",
      "exoplanets discovered",
      "physics explained",
      "black holes explained",
    ],
  },
  {
    category: "Psychology & Self-Improvement",
    keywords: [
      "psychology facts",
      "stoicism for beginners",
      "habits of successful people",
      "how to be productive",
      "self improvement journey",
    ],
  },
];

export const listKeywords = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("keywords").take(500);
  },
});

export const _listActiveKeywords = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("keywords")
      .filter((q) => q.eq(q.field("active"), true))
      .take(200);
  },
});

export const addKeyword = mutation({
  args: {
    keyword: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    const keyword = args.keyword.trim().toLowerCase();
    const category = args.category.trim();
    if (!keyword || !category) {
      throw new Error("Keyword and category are required");
    }
    return await ctx.db.insert("keywords", {
      keyword,
      category,
      active: true,
      addedBy: (await getIdentityEmail(ctx)) ?? undefined,
    });
  },
});

export const toggleKeyword = mutation({
  args: {
    keywordId: v.id("keywords"),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    await ctx.db.patch("keywords", args.keywordId, { active: args.active });
  },
});

export const deleteKeyword = mutation({
  args: {
    keywordId: v.id("keywords"),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    await ctx.db.delete("keywords", args.keywordId);
  },
});

export const seedDefaultKeywords = mutation({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    const existing = await ctx.db.query("keywords").take(1);
    if (existing.length > 0) {
      return { seeded: false, inserted: 0 };
    }
    const addedBy = (await getIdentityEmail(ctx)) ?? undefined;
    let inserted = 0;
    for (const group of seedCategories) {
      for (const keyword of group.keywords) {
        await ctx.db.insert("keywords", {
          keyword,
          category: group.category,
          active: true,
          addedBy,
        });
        inserted++;
      }
    }
    return { seeded: true, inserted };
  },
});
