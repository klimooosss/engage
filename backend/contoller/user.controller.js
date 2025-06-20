import mongoose from "mongoose";

import User from "../models/user.model.js";

export const createUser = async (req, res) => {
    const user = req.body;

    //checks if the forms are filled correctly 
    if(!user.email || !user.password || !user.userType || !user.phone || !user.username) {
        return res.status(400).json({ success:false, message: "Please fill out the forms correctly." });
    }

    //create an instance of the new user 
    const newUser = new User(user)

    try {
        await newUser.save(); // saves to the datatbase
        res.status(200).json({success:true, data:newUser}) // returns status code of 201(success) and logs the new usert data
    } catch (error) {
        console.error("Error in Create user:", error.message)
        res.status(500).json({ success:false, message:"Internal server error." })
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        var founduser = await User.findById(id);
        res.status(200).json({success:true, message:"User found successfully.", data:founduser})
        return founduser
    } catch (error) {
        res.status(500).json({success:false, message:"Couldn't find the User."})
        console.error(error)
    }
}

export const updateUser = async (req, res) => {
    const {id} = req.params;

    const user = req.body;

    if(mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success:false, message:"Invalid User ID"})
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, {new:true})
        res.status(200).json({success:true, data:updatedUser})
    } catch (error) {
        res.status(500).json({success:false, message:"Couldn't update the User."})
        console.error(error)
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({success:true, message:"User deleted successfully."})
    } catch (error) {
        res.status(500).json({success:false, message:"Couldn't delete the User."})
        console.error(error)
    }
}