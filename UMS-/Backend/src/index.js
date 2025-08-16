// require('dotenv').config({path: './env'})   //will work though
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
    path : './.env'
})

connectDB()  //promise...
.then(()=>{
    // console.log(app._router.stack) 
    console.log("MongoDB URI:", process.env.MONGODB_URI);
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`Server is running at: http://localhost:${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log("MONGO_DB CONNECTION FAILED: ", err);
})












































































// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express"
// const app = express()


// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error)=>{
//             console.log("Err", error);
//             throw error
//         })

//         app.listne(process.env.PORT, () =>{
//             console.log(`App is listenting on port http://localhost:${process.env.PORT}`)
//         })

//     } catch (error) {
//         console.error("Error", error);
//         throw error;
//     }
// })()