import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createVehicle = mutation({
  args: {
    clientName: v.string(),
    clientPhoneNumber: v.string(),
    make: v.string(),
    plateNumber: v.string(),
    expiryDate: v.number(),
    reminderInterval: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorised");
    }

    await ctx.db.insert("vehicles", {
      userId,
      clientName: args.clientName,
      clientPhoneNumber: args.clientPhoneNumber,
      make: args.make,
      plateNumber: args.plateNumber,
      expiryDate: args.expiryDate,
      reminderInterval: args.reminderInterval,
    });
  },
});

export const getVehicles = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorised");
    }

    await ctx.db
      .query("vehicles")
      .filter((query) => query.eq(query.feild("userId"), userId))
      .collect();
  },
});
