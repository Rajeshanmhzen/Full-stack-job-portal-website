
import {Company} from "../../models/company.model.js"
export const registerCompany = async (req, res) => {
    try {
        const {companyName} = req.body
        if(!companyName) {
            return res.json({
                message:"Company name is rquired!",
                error:true,
                success:false
            })
        };

            let company = await Company.findOne({name:companyName});
            if(company) {
                return res.status(400).json({
                    message:"The company si already registered!",
                    success:false,
                    error:true
                })
            };

            company = await Company.create({
                name:companyName,
                userId: req.id
            });
            return res.status(200).json({
                messagae:"Company Created Successfully",
                company,
                error:false,
                success:true
            });
        
        
    } catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}