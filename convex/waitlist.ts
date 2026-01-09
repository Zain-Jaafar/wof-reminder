import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("Email already on waitlist");
    }

    await ctx.db.insert("waitlist", {
      name: args.name,
      email: args.email,
      createdAt: Date.now(),
    });
  },
});
