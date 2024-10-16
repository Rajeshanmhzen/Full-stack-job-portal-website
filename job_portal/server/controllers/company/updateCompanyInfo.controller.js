import { Company } from "../../models/company.model.js"

export const updateCompany = async (req, res)=> {
    try {
        const id = req.params.id;
        const {name, description, website, location} = req.body;
        const file = req.file

        const updateData= {
            name,
            description,
            website, 
            location
        }

        const company = await Company.findByIdAndUpdate(id, updateData, {new:true});

        if(!company) {
            return res.status(400).json({
                message : err.message || err  ,
                error : true,
                success : false,
            })
        }
        if(company) {
            res.status(200).json({
                message:"Company Updated Successfully",
                company,
                error:false,
                success:true
            })

        }
        
    } catch(err){
        res.status(400).json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
    }