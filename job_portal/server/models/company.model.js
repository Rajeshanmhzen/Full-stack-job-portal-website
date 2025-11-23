import mongoose from "mongoose";

const companySchema =  new mongoose.Schema({
    name : {
        type: String,
        required: true,
        unique:true
    },
    description : {
        type: String,
    },
    location: {
    type: String,
    },
    website: {
        type: String,
    },
    logo: {
        type:String
    },
    email:String,
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps:true});

// Add indexes for better performance
companySchema.index({ name: "text", description: "text" });
companySchema.index({ name: 1 });
companySchema.index({ location: 1 });
companySchema.index({ userId: 1 });

const Company = mongoose.model("Company", companySchema);
export { Company };