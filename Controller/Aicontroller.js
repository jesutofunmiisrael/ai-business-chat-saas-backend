const Workspace = require("../Models/WorkspaceModel");

const {
  generateAIResponse,
} = require("../Services/geminiService");

const Conversation = require(
  "../Models/ConversationModel"
);

const { getIO } = require(
  "../Sockets/socket"
);

const chatWithAI = async (
  req,
  res
) => {
  try {
    const { message, conversationId } =
      req.body;

    const workspace =
      await Workspace.findById(
        req.user.workspace
      );

    if (!workspace) {
      return res.status(404).json({
        message:
          "Workspace not found",
      });
    }

    let conversation;

    if (conversationId) {
      conversation =
        await Conversation.findById(
          conversationId
        );
    } else {
      conversation =
        await Conversation.create({
          workspace: workspace._id,
          messages: [],
        });
    }

    conversation.messages.push({
      sender: "customer",
      text: message,
    });

    const aiResponse =
      await generateAIResponse(
        workspace,
        message
      );

    conversation.messages.push({
      sender: "ai",
      text: aiResponse,
    });

    await conversation.save();

    getIO()
      .to(conversation._id.toString())
      .emit("newMessage", {
        conversationId:
          conversation._id,

        messages:
          conversation.messages,
      });

    res.status(200).json({
      conversationId:
        conversation._id,

      reply: aiResponse,

      messages:
        conversation.messages,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getConversations = async (
  req,
  res
) => {
  try {
    const conversations =
      await Conversation.find({
        workspace:
          req.user.workspace,
      }).sort({
        createdAt: -1,
      });

    res
      .status(200)
      .json(conversations);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getSingleConversation =
  async (req, res) => {
    try {
      const conversation =
        await Conversation.findById(
          req.params.id
        );

      if (!conversation) {
        return res.status(404).json({
          message:
            "Conversation not found",
        });
      }

      res
        .status(200)
        .json(conversation);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

const sendAgentMessage =
  async (req, res) => {
    try {
      const { message } =
        req.body;

      const conversation =
        await Conversation.findById(
          req.params.id
        );

      if (!conversation) {
        return res.status(404).json({
          message:
            "Conversation not found",
        });
      }

      conversation.status =
        "human";

      conversation.messages.push({
        sender: "agent",
        text: message,
      });

      await conversation.save();

      getIO()
        .to(
          conversation._id.toString()
        )
        .emit("newMessage", {
          conversationId:
            conversation._id,

          messages:
            conversation.messages,
        });

      res.status(200).json({
        message:
          "Agent reply sent",

        conversation,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

const publicWidgetChat =
  async (req, res) => {
    try {
      const {
        message,
        conversationId,
      } = req.body;

      const workspace =
        await Workspace.findOne({
          widgetToken:
            req.params.token,
        });

      if (!workspace) {
        return res.status(404).json({
          message:
            "Workspace not found",
        });
      }

      let conversation;

      if (conversationId) {
        conversation =
          await Conversation.findById(
            conversationId
          );
      } else {
        conversation =
          await Conversation.create({
            workspace:
              workspace._id,

            messages: [],
          });
      }

      conversation.messages.push({
        sender: "customer",
        text: message,
      });

      let aiResponse = "";

      if (
        conversation.status ===
        "human"
      ) {
        aiResponse =
          "A human agent will assist you shortly.";
      } else {
        aiResponse =
          await generateAIResponse(
            workspace,
            message
          );

        conversation.messages.push({
          sender: "ai",
          text: aiResponse,
        });
      }

      await conversation.save();

      getIO()
        .to(
          conversation._id.toString()
        )
        .emit("newMessage", {
          conversationId:
            conversation._id,

          messages:
            conversation.messages,
        });

      res.status(200).json({
        conversationId:
          conversation._id,

        reply: aiResponse,

        messages:
          conversation.messages,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

const closeConversation =
  async (req, res) => {
    try {
      const conversation =
        await Conversation.findById(
          req.params.id
        );

      if (!conversation) {
        return res.status(404).json({
          message:
            "Conversation not found",
        });
      }

      conversation.status =
        "closed";

      await conversation.save();

      res.status(200).json({
        message:
          "Conversation closed",

        conversation,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  chatWithAI,

  getConversations,

  getSingleConversation,

  sendAgentMessage,

  publicWidgetChat,

  closeConversation,
};

