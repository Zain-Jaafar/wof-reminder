import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  waitlist: defineTable({
    name: v.string(),
    email: v.string(),
  }).index("by_email", ["email"]),
  u: defineTable({
    name: v.string(),
    email: v.string(),
    subscription: v.string(),
  }).index("by_email", ["email"]),
  vehicles: defineTable({
    userId: v.string(),
    clientName: v.string(),
    clientPhoneNumber: v.string(),
    make: v.string(),
    plateNumber: v.string(),
    expiryDate: v.number(),
    reminderInterval: v.number(),
  }).index("by_plateNumber", ["plateNumber"]),
});
