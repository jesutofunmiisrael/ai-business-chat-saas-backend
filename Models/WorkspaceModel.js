const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    agents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

businessName: {
  type: String,
},

businessType: {
  type: String,
},

businessDescription: {
  type: String,
},

tone: {
  type: String,
  default: "professional",
},
widgetToken: {
  type: String,
},


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Workspace",
  workspaceSchema
);