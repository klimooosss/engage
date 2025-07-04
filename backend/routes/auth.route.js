import e from "express";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'

const authRouter = e.Router();

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"});
}

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
        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`

        const user = new User({
            email,
            username,
            password,
            profileImage,
        });

        await user.save();

        const token = generateToken(user._id)
        res.status(201).json({
            token,
            user:{
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.log("Error in register route")
        res.status(500).json({message:"Inner Server Error."})
    }
});

authRouter.post("/login", async (req, res) =>{
    try {
        const {email, password} = req.body;

        if (!email || !password) return res.status(400).json({message:"All fields are required."})

        //check if user exists
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message:"User does not exist."});

        //check if the password correct
        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials."});

        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
        });
    } catch (error) {
        console.log("Error in login route", error);
        res.status(500).json({message:"Internal server error"});
    }
});

export default authRouter;