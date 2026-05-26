// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const authRoutes = require("./Routes/authRoutes");
// const workspaceRoutes = require("./Routes/Workspaceroute")
// const aiRoutes = require("./Routes/AiRoutes")
// const rateLimit = require("express-rate-limit");
// const path = require("path");

// const app = express();

// const aiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,

//   max: 100,

//   message:
//     "Too many requests, please try again later.",
// });



// app.use(cors());
// app.use(express.json());

// app.use(
//   express.static(
//     path.join(__dirname, "public")
//   )
// );

// app.get("/", (req, res) => {
//   res.send("AI Business Chat SaaS API Running...");
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/workspaces", workspaceRoutes);
// app.use("/api/ai", aiLimiter, aiRoutes);


// module.exports = app;