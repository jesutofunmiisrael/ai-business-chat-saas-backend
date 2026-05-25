const Workspace =
  require("../Models/WorkspaceModel");

const User =
  require("../Models/UserModel");

const {
  v4: uuidv4,
} = require("uuid");

const createWorkspace =
  async (req, res) => {
    try {
      const {
        companyName,
        companyWebsite,
        companySize,
        industry,
      } = req.body;

      const workspace =
        await Workspace.create({
          companyName,

          companyWebsite,

          companySize,

          industry,

          owner:
            req.user._id,

          agents: [
            req.user._id,
          ],

          widgetToken:
            uuidv4(),
        });

      await User.findByIdAndUpdate(
        req.user._id,
        {
          role: "admin",

          workspace:
            workspace._id,
        }
      );

      res.status(201).json({
        message:
          "Workspace created successfully",

        workspace,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const getWorkspace =
  async (req, res) => {
    try {
      const workspace =
        await Workspace.findById(
          req.user.workspace
        )
          .populate(
            "owner",
            "name email"
          )
          .populate(
            "agents",
            "name email role"
          );

      if (!workspace) {
        return res
          .status(404)
          .json({
            message:
              "Workspace not found",
          });
      }

      res
        .status(200)
        .json(workspace);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };



  const updateWorkspaceAI =
  async (req, res) => {
    try {
      const {
        businessDescription,
        aiHelp,
        tone,
      } = req.body;

      const workspace =
        await Workspace.findByIdAndUpdate(
          req.user.workspace,
          {
            businessDescription,

            aiHelp,

            tone,
          },
          {
            new: true,
          }
        );

      if (!workspace) {
        return res
          .status(404)
          .json({
            message:
              "Workspace not found",
          });
      }

      res.status(200).json({
        message:
          "AI setup completed",

        workspace,
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
  createWorkspace,
  getWorkspace,
  updateWorkspaceAI 
};