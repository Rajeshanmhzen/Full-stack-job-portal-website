import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { COMPANY_API_END_POINT } from "../../utils/constant";
import axios from "axios";
import { Button, FileInput, Textarea, TextInput } from "@mantine/core";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";

const AddCompanyDetails = () => {
  const { singleCompany } = useSelector(store => store.company);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [formData, setFormData] = useState({
    logo: null,
    name: "",
    email: "",
    website: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    let company = null;
    
    // First check if singleCompany exists and matches the ID
    if (singleCompany && singleCompany._id === id) {
      company = singleCompany;
    } 
      fetchCompanyData();
    
  }, [singleCompany]);

  const fetchCompanyData = async () => {
    try {
      const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
        withCredentials: true,
      });
      
      if (res.data.company) {
        const company = res.data.company;
        setCurrentCompany(company);
        setFormData({
          logo: null,
          name: company.name || "",
          email: company.email || "",
          website: company.website || "",
          location: company.location || "",
          description: company.description || "",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to fetch company data",
        color: "red",
      });
      navigate("/company");
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      if (formData.logo) data.append("logo", formData.logo);
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("website", formData.website);
      data.append("location", formData.location);
      data.append("description", formData.description);
      
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${id}`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (res.data.success) {
        notifications.show({
          title: "Success",
          message: "Company updated successfully",
          color: "green",
        });
        setTimeout(() => {
          navigate("/company");
        }, 1000);
      }
    } catch (err) {
      notifications.show({
        title: "Update Failed",
        message: err?.response?.data?.message || "Something went wrong",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentCompany) {
    return (
      <div className="w-1/2 mx-auto text-center py-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Loader size={20} className="animate-spin" />
          <p>Loading company data...</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate("/company")}
          className="mt-4 text-purple-heart-500"
        >
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="w-1/2 shadow-sm shadow-purple-heart-700 px-5 py-5 rounded-sm mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Update Company Details</h2>
        <p className="text-sm text-gray-600">Editing: {currentCompany.name}</p>
      </div>
      
      <form className="flex flex-col gap-2">
        <FileInput 
          clearable 
          label="Upload company logo" 
          placeholder="Upload logo" 
          value={formData.logo}  
          onChange={(file) => setFormData({...formData, logo: file})}
        />
        <TextInput
          label="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
        <TextInput
          label="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
        <TextInput
          label="Website"
          value={formData.website}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
        />
        <TextInput
          label="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
        <Textarea
          label="Description"
          minRows={2}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => navigate("/company")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-purple-heart-500 hover:bg-purple-heart-600"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader size={16} className="animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCompanyDetails;