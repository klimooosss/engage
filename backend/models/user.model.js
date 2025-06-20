import mongoose from "mongoose";
import bcrypt, { compare } from 'bcrypt'

//test user schema for testing
const testUserSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
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
    profileImage:{
        type:String,
        default:""
    }
},
    {
        timestamps: true, //createdAt. updatedAt
    }
);
// template for users cluster
// const userSchema = new mongoose.Schema({
//     username: {
//         type:String,
//         required: true,
//     },
//     phone: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     adress: {
//         type: String,
//         required: false
//     },
//     desc:{
//         type:String,
//         required: false
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6
//     },
//     userType: {
//         type:String,
//         required: true
//     },
//     profileImage:{
//         type:String,
//         default:""
//     }
// },
//     {
//         timestamps: true, //createdAt. updatedAt
//     }
// );
//hash the password before saving user to the db.
testUserSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next()
});

// compare password function
testUserSchema.methods.comparePassword = async function(userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model('User', testUserSchema);

export default User;