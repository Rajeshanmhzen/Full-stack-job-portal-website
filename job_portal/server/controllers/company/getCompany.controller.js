import { Company } from "../../models/company.model.js"

export  const getCompany = async (req, res)=> {
    try {
        const userId = req.id
        const companies = await Company.find({userId});
        if(!companies)  {
            return res.status(400).json ({
                message:"Companies not found!",
                success:false,
                error:true
            })
        }
        res.status(200).json({
            companies,
            error:false,
            success:true
        })
    } catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}


// get Company by id

export const getCompanyById = async (req,res) => {

    try {
        
        const companyId = req.params.id;
        const company = await Company.findById(companyId)
        if(!company)  {
            return res.status(404).json ({
                message:"Company not found!",
                success:false,
                error:true
            })
        };

        return res.status(200).json({
            message:"Company Found Successfully",
            company,
            success:true,
            error:false
        })
    } catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}