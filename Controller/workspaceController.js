const Workspace = require("../Models/WorkspaceModel")
const User = require("../Models/UserModel")
const { v4: uuidv4 } = require("uuid");


const createWorkspace = async(req, res)=>{
    try {
        const {name, aiPrompt} = req.body


        const workspace = await Workspace.create({
            name,
            owner:req.user._id,
            agents:[req.user._id],
            aiPrompt,
            widgetToken: uuidv4(),
        });


        await User.findByIdAndUpdate(req.user._id,{
         role:"admin",
         workspace: workspace._id,
        });

         
        res.status(201).json({
            message:"Workspace created successfully",
            workspace,
        })


    } catch (error) {
        res.status(500).json({
        message:error.message
        });
    console.log(error);
    }
}





const getWorkspace = async (req, res) =>{
    try {
       const workspace = await Workspace.findById(
        req.user.workspace
       ) 
        .populate("owner", "name email")
        .populate("agents", "name, email role")

        if(!workspace) {
            return res.status(404).json({
                message:"Workspace not found"
            })
        }

        res.status(200).json(workspace)


    } catch (error) {
    res.status(500).json({
        message:error.message,
    
    })
    console.log(error);
    
    }
}

module.exports = {
  createWorkspace,
   getWorkspace
};