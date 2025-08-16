import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(           //use used for middleware
  cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true, 
  })
);  

app.use(express.json({limit:"16mb"})) //body parser 
// // limit is used to limit the size of the request body

app.use(express.urlencoded({extended:true, limit: "16mb"})) //body parser
// // extended is used to parse nested objects in the request body 

app.use(express.static("public")) //static files
// // public folder is used to serve static files

app.use(cookieParser()) //cookie parser
// //  It extracts the cookies from the request headers, decodes them, and makes them available as a JavaScript object.

//routes import
import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js";
import projectRouter from "./routes/project.routes.js";
import projectMarksRouter from "./routes/projectMarks.routes.js";
import leaveRoutes from "./routes/leave.routes.js";


// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/profile", profileRouter) //profile routes
app.use("/api/v1/projects", projectRouter) //project routes
app.use("/api/v1/projectMarks", projectMarksRouter ) //Projectmarks routes
app.use("/api/v1/leave", leaveRoutes);

//error handling middleware
app.use(errorHandler);

export { app };
