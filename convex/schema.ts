import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    subscription: v.optional(v.string()),
  }).index("email", ["email"]),
  waitlist: defineTable({
    name: v.string(),
    email: v.string(),
  }).index("by_email", ["email"]),
  vehicles: defineTable({
    userId: v.id("users"),
    clientName: v.string(),
    clientPhoneNumber: v.string(),
    make: v.string(),
    plateNumber: v.string(),
    expiryDate: v.number(),
    reminderInterval: v.number(),
  }).index("by_plateNumber", ["plateNumber"]),
});
