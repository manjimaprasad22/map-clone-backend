const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already exist"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    isverified: {
        type: Boolean,
        required: true
    },
},
{
    timestamps: true
}
);
module.exports = mongoose.model("User", userSchema)