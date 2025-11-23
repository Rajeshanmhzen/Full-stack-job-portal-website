import express from "express"
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import userRoute from "./routes/user.routes.js"
import companyRoute from "./routes/company.route.js"
import JobRoute  from "./routes/job.route.js"
import ApplicationRoute  from "./routes/application.route.js"
import ResumeRoute  from "./routes/resume.route.js"
import searchRoutes from "./routes/search.route.js";
import noticationsRoute from "./routes/notification.route.js"
import cache from "./utils/cache.js"
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads/company-logos', express.static(path.join(__dirname, 'uploads/company-logos')));

// For resume files
app.use('/uploads/resume-files', express.static(path.join(__dirname, 'uploads/resumes')));

// For user profile pictures
app.use('/uploads/profile-pic', express.static(path.join(__dirname, 'uploads/user-profiles')));

// router setup
app.use("/api/v1/user", userRoute)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", JobRoute)
app.use("/api/v1/application", ApplicationRoute)
app.use("/api/v1/resume", ResumeRoute)
app.use("/api/search", searchRoutes);
app.use("/api/v1/notification", noticationsRoute)

// Health check endpoint for testing
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000

// Initialize cache and database
Promise.all([
    connectDB(),
    cache.init()
]).then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Server is running at PORT: http://localhost:${PORT}`)
        console.log('✅ All systems initialized successfully')
    });
}).catch(err => {
    console.error('❌ Failed to initialize server:', err);
    process.exit(1);
});
