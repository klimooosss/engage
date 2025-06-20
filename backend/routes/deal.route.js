import e from 'express';
import mongoose from 'mongoose';
import { createDeal, deleteDeal, getDeal, updateDeal } from '../contoller/deal.controller.js';

const dealRouter = e.Router();

//gets post request to make a deal and write it to the db.
dealRouter.post("/create", createDeal);

dealRouter.delete("/:dealId", deleteDeal);

dealRouter.put("/:dealId", updateDeal);

dealRouter.get("/:dealId", getDeal)

async function validateUserId(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return false;
    }
    const user = await User.findById(userId);
    return !!user; 
}

export default dealRouter;