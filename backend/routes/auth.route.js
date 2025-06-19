import e from "express";
import User from "../models/user.model.js";

const authRouter = e.Router();

authRouter.post("/register", async (req, res) => {
    try {
        const {email,username,password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({message: "All field are required."})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must to be at least 6 charachter long."})
        }
        if(username.length < 3){
            return res.status(400).json({message: "Username must to be at least 3 charachter long."})
        }
        //check if user already exists.
        const existingEmail= await User.findOne({$or:[{email}]});
        if(existingEmail) return res.status(400).json({message:"User with this email already exists"})

        const existingUsername = await User.findOne({$or:[{username}]});
        if(existingUsername) return res.status(400).json({message:"Username is taken"})

        //get random avatar
        const profileImage = `https://api.dicebear.com/7.x/avataars/svg?seed=${username}`

        const user = new User({
            email,
            username,
            password,
            profileImage,
        });

        await user.save();
    } catch (error) {
        
    }
})

export default authRouter;