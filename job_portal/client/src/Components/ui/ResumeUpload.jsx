import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Loader2, UploadCloud } from "lucide-react";
import { setRecommendations, setResume } from "../../store/resumeSlice";
import { RESUME_API_END_POINT } from "../../utils/constant";
import { notifications } from "@mantine/notifications";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UploadResume = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { recommendations, resume } = useSelector((state) => state.resume);


  // Debug: Monitor Redux state changes
  useEffect(() => {
  
  }, [recommendations, resume]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      console.log("Starting upload...");
      
      const res = await axios.post(`${RESUME_API_END_POINT}/upload`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (res.data.success) {
        console.log("=== UPLOAD SUCCESS ===");
        console.log("Full API Response:", res.data);
        console.log("Recommendations from API:", res.data.recommendations);
        console.log("Resume from API:", res.data.resume);

        if (res.data.recommendations && Array.isArray(res.data.recommendations)) {
          console.log("Dispatching recommendations:", res.data.recommendations.length, "items");
          dispatch(setRecommendations(res.data.recommendations));
        } else {
          console.warn("Invalid recommendations data:", res.data.recommendations);
          dispatch(setRecommendations([]));
        }
        
        if (res.data.resume) {
          console.log("Dispatching resume data:", res.data.resume);
          dispatch(setResume(res.data.resume));
        } else {
          console.warn("No resume data received");
        }

        notifications.show({
          title: "Resume Uploaded Successfully",
          message: `Found ${res.data.recommendations?.length || 0} job recommendations`,
          icon: <FaCheckCircle />,
          color: "teal",
          withBorder: true,
          className: "!border-green-500",
          autoClose: 3000,
        });

        // Navigate with a delay to ensure state is updated
        setTimeout(() => {
          console.log("Navigating to recommendations page...");
          navigate('/user/recommendations');
        }, 1500);
        
      } else {
        console.error("Upload failed:", res.data);
        setMessage("Upload failed: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      console.error("Error response:", err.response?.data);
      
      const errorMessage = err.response?.data?.message || "Failed to upload resume";
      setMessage(errorMessage);
      
      notifications.show({
        title: "Upload Failed",
        message: errorMessage,
        color: "red",
        withBorder: true,
        className: "!border-red-500",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center w-full p-4 shadow-md shadow-purple-700 rounded-lg max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-10 text-center">Upload Your Resume</h2>
      
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="block w-full text-sm cursor-pointer text-gray-500 file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0 file:text-sm file:font-semibold
        file:bg-mine-shaft-100 file:text-purple-heart-700 hover:file:bg-mine-craft-100 file:cursor-pointer"
      />

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="mt-4 px-6 py-2 bg-purple-heart-600 text-mine-shaft-50 rounded-md hover:bg-purple-heart-700 transition disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" /> Uploading...
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" /> Upload Resume
          </>
        )}
      </button>

      {message && (
        <p className={`mt-4 text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadResume;