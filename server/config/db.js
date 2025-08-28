import mongoose from "mongoose"

const connectDB = async() => {
    try {
        console.log("Connect to Database Successfully")
     await mongoose.connect(process.env.MONGODB_URI)
    } catch (err) {
        console.log(err)

        
    }
}
export default connectDB;