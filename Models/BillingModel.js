const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      unique: true,
    },

    plan: {
      type: String,
      enum: [
        "free",
        "growth",
        "pro",
        "enterprise",
      ],
      default: "free",
    },

    status: {
      type: String,
      enum: [
        "active",
        "cancelled",
        "past_due",
      ],
      default: "active",
    },

    monthlyPrice: {
      type: Number,
      default: 0,
    },

    currentPeriodStart: Date,

    currentPeriodEnd: Date,

    stripeCustomerId: String,

    stripeSubscriptionId: String,
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Billing",
    billingSchema
  ); 