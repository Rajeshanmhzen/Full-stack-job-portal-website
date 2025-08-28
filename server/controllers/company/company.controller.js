import {Company} from "../../models/company.model.js"
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
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
                    message:"The company is already registered!",
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
};
export const updateCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, website, location, email } = req.body;
    const file = req.file;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found", error: true, success: false });
    }

    const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

    if (file && company.logo) {
      const oldLogoPath = path.join(__dirname, '../../uploads/company-logos', company.logo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath); // delete old file
      }
    }

    const updateData = {
      name,
      email,
      description,
      website,
      location,
      ...(file && { logo: file.filename }), // only set new file if uploaded
    };

    const updatedCompany = await Company.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({
      message: "Company Updated Successfully",
      company: updatedCompany,
      error: false,
      success: true,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
      error: true,
      success: false,
    });
  }
};
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
};
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
};
export const searchCompaniesByname = async(req,res)=> {
    try {
        const userId = req.id
        const {name} = req.query
        let filter = {userId}
        if (name) {
      filter.name = { $regex: name, $options: "i" }; 
    }
    const companies = await Company.find(filter).sort({createdAt: -1})
    if (companies.length === 0) {
      return res.status(404).json({
        message: "No company found for this user with the given name.",
        success: false,
        error: false,
      });
    }

    res.status(200).json({
      companies,
      success: true,
      error: false,
    });
    } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
}