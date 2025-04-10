import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import userRoute from "./routes/user.routes.js"
import companyRoute from "./routes/company.route.js"
import JobRoute  from "./routes/job.route.js"
import ApplicationRoute  from "./routes/application.route.js"
// import resumeRoute  from "./routes/resume.route.js"

import dotenv from "dotenv"
dotenv.config({})


const app = express();

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())


const corsOptions = {
    origin: "http://localhost:5173",
    credentials:true,
    exposeHeaders: ['Access-Control-Allow-Credentials'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))

// router setup
app.use("/api/v1/user", userRoute)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", JobRoute)
app.use("/api/v1/application", ApplicationRoute)
// app.use("/api/resume", resumeRoute)


const PORT = process.env.PORT || 3000
connectDB().then(()=> {
    app.listen(PORT, ()=> {
        console.log("Connect to Database Successfully")
        console.log(`Server is running at PORT: http://localhost:${PORT}`)
    });
});
