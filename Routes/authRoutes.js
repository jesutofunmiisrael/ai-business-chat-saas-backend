const express = require("express");
const {
  registerUser,
  loginUser,
} = require("../Controller/Authcontroller");
const { protect } = require("../Middlewares/Authmiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;