const express = require("express");

const {
  chatWithAI,
  getConversations,
  getSingleConversation,
  sendAgentMessage,
  publicWidgetChat,
  closeConversation,
} = require("../Controller/Aicontroller");

const {
  protect,
} = require("../Middlewares/Authmiddleware");

const router = express.Router();

router.post("/chat", protect, chatWithAI);
router.get("/conversations",
  protect,
  getConversations);

  router.get(
  "/conversations/:id",
  protect,
  getSingleConversation
);


router.post(
  "/conversations/:id/agent",
  protect,
  sendAgentMessage
);

router.post(
  "/widget/chat/:token",
  publicWidgetChat
);


router.patch(
  "/conversations/:id/close",
  protect,
  closeConversation
);




module.exports = router;