const express = require("express");
const router = express.Router();
const {register, login, currentuser, verifyOTP,sendotp, addhistory,getHistoryById} = require('../controllers/userController');
const validatetoken = require("../middleware/validateTokenHandler");

router.post('/register',register);
router.post('/verifyotp',verifyOTP);
router.post('/resendotp',sendotp);
router.route("/login").post(login);
router.route("/addhistory").post(addhistory);
router.get("/get-history/:id",validatetoken,getHistoryById);
router.get("/current",validatetoken, currentuser);


module.exports = router; 