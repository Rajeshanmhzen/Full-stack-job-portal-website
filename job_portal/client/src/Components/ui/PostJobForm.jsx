import { useState } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "../../utils/constant";
import { notifications } from "@mantine/notifications";

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(
        `${JOB_API_END_POINT}/job/post`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        notifications.show(res.data.message);
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
        notifications.show(res.data.message);
      }
    } catch (err) {
      notifications.show(err.response?.data?.message || "Job post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl  mx-auto px-6 py-12 rounded-xl shadow-lg " >
      <h2 className="text-4xl font-extrabold text-purple-heart-600 mb-2 text-center tracking-wide drop-shadow-md">
        Post a New Job
      </h2>

      <form
        onSubmit={handleSubmit}
        className=" rounded-xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-300 focus:outline-none transition"
          required
        />
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Position"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-300 focus:outline-none transition"
          required
        />
        <input
          type="text"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          placeholder="Company ID"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-300 focus:outline-none transition"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Job Location"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-300 focus:outline-none transition"
          required
        />
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-300 focus:outline-none transition"
          required
        />
        <input
          type="text"
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          placeholder="Job Type (Full-time, Part-time)"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-300 focus:outline-none transition"
          required
        />

        {/* Experience */}
        <input
          type="text"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Experience Level (Entry, Mid, Senior)"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-300 focus:outline-none transition"
          required
        />

        {/* Requirements */}
        <input
          type="text"
          name="requirement"
          value={formData.requirement}
          onChange={handleChange}
          placeholder="Requirements (comma separated)"
          className="px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-300 focus:outline-none transition"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Job Description"
          rows={5}
          className="col-span-full px-5 py-4 border border-gray-300 rounded-xl shadow-sm resize-none focus:ring-4 focus:ring-indigo-300 focus:outline-none transition"
          required
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-lg transition"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJobForm;

