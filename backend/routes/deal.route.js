import e from 'express';
import mongoose from 'mongoose';
import protectRoute from '../middleware/auth.middleware.js';

const dealRouter = e.Router();

//gets post request to make a deal and write it to the db.
dealRouter.post("/create", protectRoute, async (req, res) => {
    try {
        const {name, desc, price, companyAccId, Image} = req.body;

        if(!name && name > 3 || !desc || !price || !companyAccId) return res.status(400).json({ message: "All fields are required."});

        const deal = new Deal({
            name,
            desc,
            price,
            Image,
            user: req.user._id,
        });

        if (validateUserId(companyAccId)) {
            res.status(400).json({message:"User not found."})
        }
        
        await deal.save()

        res.status(200).json({message:"Deal created Successfully."})
    } catch (error) {
        console.log("Error at Deal Route.")
        res.status(500).json({message:"Internal Server Error at Deal Route."})
    }
});

dealRouter.delete("/:dealId", protectRoute, async (req, res) => {
    const { dealId } = req.params;
    try {
        const deal = await Deal.findById(dealId);
        if(!deal) return res.status(404).json({message:"Book not found."})

        if (deal.user.toString() !== req.user._id.toString())
            return res.status(401).json({message:"Unauthorized."});

        
        await Deal.deleteOne();
        res.json({success:true, message:"Deal deleted successfully."})

    } catch (error) {
        res.status(500).json({success:false, message:"Couldn't delete the Deal."})
        console.error(error)
    }
});

dealRouter.put("/:dealId", protectRoute, async (req, res) => {
    try {
        const {dealId} = req.params;
        
        const deal = req.body;

        if(!mongoose.Types.ObjectId.isValid(dealId)) {
            return res.status(404).json({success:false, message:"Invalid Deal ID"})
        }

        if (deal.user.toString() !== req.user._id.toString())
            return res.status(401).json({message:"Unauthorized."});


        const updatedDeal = await Deal.findByIdAndUpdate(dealId, deal, {new:true})
        res.status(200).json({data:updatedDeal})
    } catch (error) {
        res.status(500).json({success:false, message:"Couldn't update the User."})
        console.error(error)
    }
});

dealRouter.get("/:dealId", protectRoute, async (req, res) => {
    const { dealId } = req.params;
    try {
        var foundDeal = await Deal.findById(dealId);
        res.status(200).json({success:true, message:"Deal found successfully.", data:foundDeal})
    } catch (error) {
        res.status(500).json({success:false, message:"Couldn't find the Deal."})
        console.error(error)
    }
});

export default dealRouter;