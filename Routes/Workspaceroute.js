const express = require("express")

const { createWorkspace, getWorkspace } = require("../Controller/workspaceController")

const {protect} = require("../Middlewares/Authmiddleware")


const router = express.Router();

router.post("/", protect, createWorkspace);
router.get("/me", protect, getWorkspace);
module.exports = router;