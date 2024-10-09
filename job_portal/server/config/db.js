import mongoose from "mongoose"

const connectDB = async() => {
    try {
    ` mongoose.connect(process.env.MONGODB_URI)`
    } catch (err) {
        console.log(err)

        
    }
}
export default connectDB;