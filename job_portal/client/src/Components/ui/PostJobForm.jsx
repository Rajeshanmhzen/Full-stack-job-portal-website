import { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "../../utils/constant";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";

const PostJobForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirement: "",
    salary: "",
    jobType: "",
    experience: "",
    position: "",
    location: "",
    companyId: "",
  });

  const [loading, setLoading] = useState(false);
  useGetAllCompanies()
const navigate = useNavigate()
const { companies } = useSelector(store => store.company);


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle company selection from dropdown - FIXED
  const handleCompanySelect = (e) => {
    const selectedCompanyId = e.target.value;
    setFormData({...formData, companyId: selectedCompanyId});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(
        `${JOB_API_END_POINT}/post`, 
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.success) {
        notifications.show({
          title: "Success",
          message: res.data.message || "Job posted successfully",
          color: "green",
        });
        // Reset form after successful submission
        setFormData({
          title: "",
          description: "",
          requirement: "",
          salary: "",
          jobType: "",
          experience: "",
          position: "",
          location: "",
          companyId: "",
        });
      } else {
        notifications.show({
          title: "Error",
          message: res.data.message || "Failed to post job",
          color: "red",
        });
      }
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Job post failed",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
    console.log('Companies from Redux:', companies);
}, [companies]);
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-purple-heart-600 mb-2 text-center tracking-wide drop-shadow-md">
        Post a New Job
      </h2>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:border-purple-heart-600 focus:outline-none transition"
          required
        />

        <input
          type="number"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Number of Positions"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:border-purple-heart-600 focus:outline-none transition"
          required
        />

        <select
          name="companyId"
          value={formData.companyId}
          onChange={handleCompanySelect}
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:border-purple-heart-600 focus:outline-none transition"
          required
        >
          <option value="" className="bg-blue-50 text-gray-800">Select a Company</option>
          {companies && Array.isArray(companies) && companies.length > 0 ? (
            companies.map((company) => (
              <option 
                key={company._id} 
                value={company._id}
                className="bg-blue-50 text-gray-800 hover:bg-blue-100 py-2"
              >
                {company.name || 'Unnamed Company'}
              </option>
            ))
          ) : (
            <option value="" disabled className="bg-red-50 text-red-600">
              No companies available
            </option>
          )}
        </select>

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Job Location"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:border-purple-heart-600 focus:outline-none transition"
          required
        />

        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary (e.g., $50,000 - $70,000)"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:border-purple-heart-600 focus:outline-none transition"
          required
        />

        <select
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:border-purple-heart-600 focus:outline-none transitio"
         
          required
        >
          <option value="" className="bg-green-50 text-gray-800">Select Job Type</option>
          <option value="Full-time" className="bg-green-50 text-gray-800">Full-time</option>
          <option value="Part-time" className="bg-green-50 text-gray-800">Part-time</option>
          <option value="Contract" className="bg-green-50 text-gray-800">Contract</option>
          <option value="Freelance" className="bg-green-50 text-gray-800">Freelance</option>
          <option value="Internship" className="bg-green-50 text-gray-800">Internship</option>
        </select>

       <select
  name="experience"
  value={formData.experience}
  onChange={handleChange}
  className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:border-purple-heart-600 focus:outline-none transition"
  required
>
  <option value="" className="bg-purple-50 text-gray-800">Select Experience Level</option>
  <option value="Entry Level" className="bg-purple-50 text-gray-800">Entry Level</option>
  <option value="Mid Level" className="bg-purple-50 text-gray-800">Mid Level</option>
  <option value="Senior Level" className="bg-purple-50 text-gray-800">Senior Level</option>
  <option value="Executive" className="bg-purple-50 text-gray-800">Executive</option>
</select>

        <input
          type="text"
          name="requirement"
          value={formData.requirement}
          onChange={handleChange}
          placeholder="Requirements (comma separated)"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:border-purple-heart-600 focus:outline-none transition"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Job Description"
          rows={5}
          className="col-span-full px-5 py-4 border border-gray-300 rounded-xl shadow-sm resize-none focus:ring-4 focus:border-purple-heart-600 focus:outline-none transition"
          required
        ></textarea>

        <button
          type="submit"
          disabled={loading || !companies || companies.length === 0}
          className="col-span-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed font-semibold py-3 rounded-xl shadow-lg transition"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>

        {(!companies || companies.length === 0) && (
          <p className="col-span-full text-xs text-red-600 font-bold text-center my-3">
            *Please register a company first, before posting a job
          </p>
        )}
      </form>
    </div>
  );
};

export default PostJobForm;