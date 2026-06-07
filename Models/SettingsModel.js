const mongoose =
  require("mongoose");

const settingsSchema =
  new mongoose.Schema(
    {
      workspaceId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Workspace",

        required: true,

        unique: true,
      },

      businessName: {
        type: String,

        default: "",
      },

      businessWebsite: {
        type: String,

        default: "",
      },

      supportEmail: {
        type: String,

        default: "",
      },

      aiName: {
        type: String,

        default:
          "ApexChat AI",
      },

      welcomeMessage: {
        type: String,

        default:
          "Hi! How can I help you today?",
      },
aiTone: {
  type: String,
  enum: [
    "Professional",
    "Friendly",
    "Playful",
    "Concise",
    "Empathetic",
  ],
  default: "Professional",
},
      autoHandoff: {
        type: Boolean,

        default: true,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Settings",
    settingsSchema
  );