const asyncHandler = require("express-async-handler")
const User = require('../models/userModel')
const SearchHistory = require('../models/searchModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const UserOTP = require('../models/UserOTPVerification'); 
const transporter = require('../config/transporter');
// login
const login = asyncHandler(async(req,res)=>{
    const {email, password}= req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields mandatory") 
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email:user.email,
                id: user.id,
                
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"2hr"}
        )
        res.status(200).json({message:"login success",
        username: user.username,
        email:user.email,
        id: user.id, 
        isverified: user.isverified,
        accessToken:accessToken })
    }else{
        res.status(401)
        throw new Error("not valid")
    }
   
});

const currentuser = asyncHandler(async(req,res)=>{
    res.json(req.user);
});


const sendotp = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Enter OTP: ${otp}</p>`
        };
        const newOTPVerification = new UserOTP({
            email: email,
            otp: otp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000 
        });
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        res.json({
            status: "PENDING",
            message: 'Verification OTP email sent'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already exists");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password: ", hashPassword);
    const user = await User.create({
        username,
        email,
        password: hashPassword,
        isverified:false
    });
    if (user) {
     
        req.body.email = email; 
        await sendotp(req, res);
    } else {
        res.status(500).json({ message: "User registration failed" });
    }
});
const verifyOTP = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            res.status(400);
            throw new Error("Email and OTP are required");
        }

        const otpRecord = await UserOTP.findOne({ email, otp });
        
        if (!otpRecord) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        const currentTime = Date.now();
        
        if (currentTime > otpRecord.expiresAt) {
            res.status(400).json({ message: "OTP has expired" });
            return;
        }

        const user = await User.findOne({ email });
        if (user) {
            user.isverified = true;  
            await user.save();

            await UserOTP.deleteOne({ email });

            res.json({ status: "SUCCESS", message: "Email verified successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const addhistory = asyncHandler(async (req, res) => {
    const { id, place } = req.body;
    

    if (!id || !place) {
        return res.status(400).json({ status: "ERROR", message: "All fields are mandatory" });
    }
    
    try {
        
        await SearchHistory.create({ id, place });
        res.status(201).json({ status: "SUCCESS", message: "Place added successfully" });
    } catch (error) {
        res.status(500).json({ status: "ERROR", message: error.message });
    }
});
const getHistoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const history = await SearchHistory.find({ id },{ place: 1, _id: 0 });

        if (!history || history.length === 0) {
            return res.status(404).json({ status: "ERROR", message: "No search history found for the given ID" });
        }

        res.status(200).json({ status: "SUCCESS", data: history });
    } catch (error) {
        res.status(500).json({ status: "ERROR", message: error.message });
    }
});
module.exports = {register, login, currentuser,sendotp, verifyOTP, addhistory,getHistoryById}