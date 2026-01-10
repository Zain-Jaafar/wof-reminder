import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  waitlist: defineTable({
    name: v.string(),
    email: v.string(),
    createdAt: v.optional(v.number()),
  }).index("by_email", ["email"]),
});
