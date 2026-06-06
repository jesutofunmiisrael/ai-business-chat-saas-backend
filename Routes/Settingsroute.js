const express =
  require("express");

const router =
  express.Router();

const {
  getSettings,
  updateSettings,
  resetSettings,
} = require(
  "../Controller/settingscontoller"
);

router.get(
  "/:workspaceId",
  getSettings
);

router.put(
  "/:workspaceId",
  updateSettings
);

router.post(
  "/reset/:workspaceId",
  resetSettings
);

module.exports =
  router;