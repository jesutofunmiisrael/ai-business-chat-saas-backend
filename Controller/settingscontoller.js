const Settings =
  require("../Models/SettingsModel");



const getSettings =
  async (req, res) => {
    try {

      const settings =
        await Settings.findOne({
          workspaceId:
            req.params.workspaceId,
        });

      res.status(200).json(
        settings
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  };

const updateSettings =
  async (req, res) => {
    try {

      console.log(
        "BODY:",
        req.body
      );

      const settings =
        await Settings.findOneAndUpdate(
          {
            workspaceId:
              req.params.workspaceId,
          },

          {
            $set: req.body,
          },

          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

      res.status(200).json(
        settings
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });

    }
  };

const resetSettings =
  async (req, res) => {
    try {

      const settings =
        await Settings.findOneAndUpdate(
          {
            workspaceId:
              req.params.workspaceId,
          },

          {
            businessName: "",
            businessWebsite: "",
            supportEmail: "",
            aiName: "ApexChat AI",
            welcomeMessage:
              "Hi! How can I help you today?",
          aiTone: 
          "Professional",
            autoHandoff:
              true,
          },

          {
            new: true,
          }
        );

      res.status(200).json(
        settings
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  };


module.exports = {
  getSettings,
  updateSettings,
  resetSettings
};