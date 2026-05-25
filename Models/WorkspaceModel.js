const mongoose =
  require("mongoose");

const workspaceSchema =
  new mongoose.Schema(
    {
      companyName: {
        type: String,
        required: true,
      },

      companyWebsite: {
        type: String,
      },

      companySize: {
        type: String,
      },

      industry: {
        type: String,
      },

      businessDescription: {
        type: String,
      },

      aiHelp: {
  type: String,
},
      tone: {
        type: String,
        default:
          "professional",
      },

      owner: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      agents: [
        {
          type:
            mongoose.Schema.Types
              .ObjectId,

          ref: "User",
        },
      ],

      widgetToken: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Workspace",
    workspaceSchema
  );