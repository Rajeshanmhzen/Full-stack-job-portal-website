import { Button } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { COMPANY_API_END_POINT } from "../../utils/constant";
import { notifications } from "@mantine/notifications";
import {useDispatch} from "react-redux"
import { setSingleCompany } from "../../store/companySlice";

const CompanyCreate = () => {
   const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleInput = (e) => {
    setCompanyName(e.target.value);
    setError("");
  };

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      setError("Company name is required");
      return;
    }

    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company))
        const companyId = res.data?.company?._id;
        navigate(`/company/create/${companyId}`);
        notifications.show({
          title: "Successfully Created",
          message: "Company name has been created",
          color: "green",
        });
      }
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err?.response?.data?.message || "Failed to create company",
        color: "red",
      });
    }
  };

  return (
    <div className="max-4xl mx-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10 rounded shadow-md shadow-purple-heart-500">
        <div>
          <Button
            leftSection={<IoMdArrowRoundBack size={17} />}
            variant="default"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
        <div className="my-10 mx-auto text-center">
          <h1 className="font-semibold text-2xl">Your Company Name</h1>
          <p>What would you like to give your company name?</p>
        </div>
        <div>
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={companyName}
            onChange={handleInput}
            placeholder="Enter your company name"
            className="w-full px-3 py-2 border rounded mt-2"
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <div className="flex justify-between items-center mt-3">
          <Button variant="outline" onClick={() => navigate(-1)} color="purple-heart.5">
            Cancel
          </Button>
          <Button variant="filled" onClick={handleSubmit} color="purple-heart.6">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
