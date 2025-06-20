import mongoose from "mongoose";

const dealSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    price: {
        type:String,
        required: true,
    },
    companyAccId: {
        type: String,
        required: true,
    },
    Image:{
        type:String,
        default:""
    }
},
    {
        timestamps: true, //createdAt. updatedAt
    }
);

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;