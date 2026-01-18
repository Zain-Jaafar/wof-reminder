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
      return [];
    }

    return await ctx.db
      .query("vehicles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const updateVehicle = mutation({
  args: {
    id: v.id("vehicles"),
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

    const vehicle = await ctx.db.get(args.id);

    if (!vehicle || vehicle.userId !== userId) {
      throw new Error("Vehicle not found or unauthorized");
    }

    await ctx.db.patch(args.id, {
      clientName: args.clientName,
      clientPhoneNumber: args.clientPhoneNumber,
      make: args.make,
      plateNumber: args.plateNumber,
      expiryDate: args.expiryDate,
      reminderInterval: args.reminderInterval,
    });
  },
});

export const deleteVehicle = mutation({
  args: {
    id: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorised");
    }

    const vehicle = await ctx.db.get(args.id);

    if (!vehicle || vehicle.userId !== userId) {
      throw new Error("Vehicle not found or unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
