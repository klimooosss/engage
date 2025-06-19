import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcrypt'

// template for users cluster
const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    adress: {
        type: String,
        required: false
    },
    desc:{
        type:String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    userType: {
        type:String,
        required: true
    },
    profileImage:{
        type:String,
        default:""
    }
},
    {
        timestamps: true, //createdAt. updatedAt
    }
);
//hash the password before saving user to the db.
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next()
})

const User = mongoose.model('User', userSchema);

export default User;