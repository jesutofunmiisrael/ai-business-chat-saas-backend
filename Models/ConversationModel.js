const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },

    customerName: {
      type: String,
      default: "Guest",
    },

    status: {
  type: String,
  enum: ["ai", "human", "closed"],
  default: "ai",
},

    messages: [
      {
        sender: {
          type: String,
          enum: ["customer", "ai", "agent"],
        },

        text: {
          type: String,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);