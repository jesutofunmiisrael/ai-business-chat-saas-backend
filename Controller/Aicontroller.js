const Workspace = require(
  "../Models/WorkspaceModel"
);

const Conversation = require(
  "../Models/ConversationModel"
);

const {
  generateAIResponse,
} = require(
  "../Services/geminiService"
);

const { getIO } = require(
  "../Sockets/socket"
);

/* ─────────────────────────────
   PRIVATE AI CHAT
───────────────────────────── */

const chatWithAI = async (
  req,
  res
) => {

  try {

    const {
      message,
      conversationId,
    } = req.body;

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

    // FIND EXISTING CONVERSATION

    if (conversationId) {

      conversation =
        await Conversation.findById(
          conversationId
        );

    }

    // CREATE NEW IF NONE

    if (!conversation) {

      conversation =
        await Conversation.create({

          workspace:
            workspace._id,

          customerName:
            "Guest",

          messages: [],

        });

    }

    // SAVE CUSTOMER MESSAGE

    conversation.messages.push({

      sender: "customer",

      text: message,

    });

    // GENERATE AI RESPONSE

    const aiResponse =
      await generateAIResponse(
        workspace,
        message
      );

    // SAVE AI MESSAGE

    conversation.messages.push({

      sender: "ai",

      text: aiResponse,

    });

    await conversation.save();

    // SOCKET EVENT

    getIO()
      .to(
        conversation._id.toString()
      )
      .emit(
        "newMessage",
        {
          conversationId:
            conversation._id,

          messages:
            conversation.messages,
        }
      );

    // RESPONSE

    res.status(200).json({

      conversationId:
        conversation._id,

      reply:
        aiResponse,

      messages:
        conversation.messages,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });

  }

};

/* ─────────────────────────────
   GET ALL CONVERSATIONS
───────────────────────────── */

const getConversations =
  async (req, res) => {

    try {

      const conversations =
        await Conversation.find({

          workspace:
            req.user.workspace,

        }).sort({

          updatedAt: -1,

        });

      res.status(200).json(
        conversations
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

/* ─────────────────────────────
   GET SINGLE CONVERSATION
───────────────────────────── */

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

      res.status(200).json(
        conversation
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

/* ─────────────────────────────
   AGENT MESSAGE
───────────────────────────── */
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

      // SAVE AGENT MESSAGE

      conversation.messages.push({

        sender: "agent",

        text: message,

      });

      await conversation.save();

      // SOCKET EVENT

      getIO()
        .to(
          conversation._id.toString()
        )
        .emit(
          "newMessage",
          {
            conversationId:
              conversation._id,

            messages:
              conversation.messages,
          }
        );

      res.status(200).json({

        message:
          "Reply sent successfully",

        conversation,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

  };
/* ─────────────────────────────
   PUBLIC WIDGET CHAT
───────────────────────────── */

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

      // FIND EXISTING CONVERSATION

      if (conversationId) {

        conversation =
          await Conversation.findById(
            conversationId
          );

      }

      // CREATE NEW CONVERSATION

      if (!conversation) {

        conversation =
          await Conversation.create({

            workspace:
              workspace._id,

            customerName:
              "Guest",

            status: "ai",

            messages: [],

          });

      }

      // SAVE CUSTOMER MESSAGE

      conversation.messages.push({

        sender: "customer",

        text: message,

      });

      let aiResponse = "";

      // HUMAN MODE

      if (
        conversation.status ===
        "human"
      ) {

        aiResponse =
          "A human agent will assist you shortly.";

      } else {

        // AI RESPONSE

        aiResponse =
          await generateAIResponse(
            workspace,
            message
          );

        // SAVE AI MESSAGE

        conversation.messages.push({

          sender: "ai",

          text: aiResponse,

        });

      }

      await conversation.save();

      // SOCKET EVENT

      getIO()
        .to(
          conversation._id.toString()
        )
        .emit(
          "newMessage",
          {
            conversationId:
              conversation._id,

            messages:
              conversation.messages,
          }
        );

      // RESPONSE

      res.status(200).json({

        conversationId:
          conversation._id,

        reply:
          aiResponse,

        messages:
          conversation.messages,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

/* ─────────────────────────────
   CLOSE CONVERSATION
───────────────────────────── */

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
        message:
          error.message,
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