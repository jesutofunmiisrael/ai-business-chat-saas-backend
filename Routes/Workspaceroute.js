const express = require("express")

const { createWorkspace, getWorkspace,  updateWorkspaceAI } = require("../Controller/workspaceController")

const {protect} = require("../Middlewares/Authmiddleware")


const router = express.Router();

router.post("/", protect, createWorkspace);
router.get("/me", protect, getWorkspace);
router.put(
  "/ai",
  protect,
  updateWorkspaceAI
);

module.exports = router;