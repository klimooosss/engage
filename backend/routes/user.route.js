import express from "express";

import {createUser, getUser, updateUser, deleteUser} from "../controller/user.controller.js"

const userRouter = express.Router();

//post request route
userRouter.post("/", createUser);
//get request route
userRouter.get("/:id", getUser);
//put request route
userRouter.put("/:id", updateUser);
//delete request route
userRouter.delete("/:id", deleteUser);

export default userRouter;