import { v } from "convex/values";

import { internalQuery, mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";

export async function getIdentityEmail(ctx: QueryCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.email ?? null;
}

export async function isAdmin(ctx: QueryCtx): Promise<boolean> {
  const email = await getIdentityEmail(ctx);
  if (!email) return false;
  const admin = await ctx.db
    .query("admins")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();
  return admin !== null;
}

export const _getIdentityEmail = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await getIdentityEmail(ctx);
  },
});

export const _isAdmin = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await isAdmin(ctx);
  },
});

export const isAdminUser = query({
  args: {},
  handler: async (ctx) => {
    return await isAdmin(ctx);
  },
});

export const hasAnyAdmins = query({
  args: {},
  handler: async (ctx) => {
    const admins = await ctx.db.query("admins").take(1);
    return admins.length > 0;
  },
});

export const getAdmins = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    return await ctx.db.query("admins").take(200);
  },
});

export const bootstrapAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("admins").take(1);
    if (existing.length > 0) {
      return { bootstrapped: false };
    }
    const email = await getIdentityEmail(ctx);
    if (!email) {
      throw new Error("Not authenticated");
    }
    await ctx.db.insert("admins", { email });
    return { bootstrapped: true };
  },
});

export const addAdmin = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    const email = args.email.trim().toLowerCase();
    if (!email) throw new Error("Email is required");
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) {
      return existing._id;
    }
    return await ctx.db.insert("admins", {
      email,
      addedBy: (await getIdentityEmail(ctx)) ?? undefined,
    });
  },
});

export const removeAdmin = mutation({
  args: {
    adminId: v.id("admins"),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }
    const admin = await ctx.db.get("admins", args.adminId);
    if (!admin) throw new Error("Admin not found");
    const selfEmail = (await getIdentityEmail(ctx)) ?? null;
    if (admin.email === selfEmail) {
      throw new Error("Cannot remove yourself");
    }
    await ctx.db.delete("admins", args.adminId);
  },
});
