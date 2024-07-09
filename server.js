const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const app = express()
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection")
const cors = require('cors')

app.use(cors())
connectDB()
const port = process.env.PORT || 5000;
app.use(express.json())
app.use('/api/users',require("./routes/userRoute"))
app.use(errorHandler)

app.listen(port,()=>{
    console.log("hello world")
 })