import { ActionIcon, Tooltip } from "@mantine/core";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_API_END_POINT } from "../../utils/constant";
import { addSavedJob, removeSavedJob, setSavedJobs } from "../../store/savedJobSlice";
import axios from "axios";

const BookmarkButton = ({ jobId }) => {
  const dispatch = useDispatch();
  const savedJobs = useSelector((state) => state.savedJob.savedJobs);
  const [loading, setLoading] = useState(false);

  const isBookmarked = savedJobs.includes(jobId);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/saved`, {
          withCredentials: true,
        });
        const ids = res.data.savedJobs.map((item) => item.job._id);
        dispatch(setSavedJobs(ids));
      } catch (e) {
        console.error("Failed to load saved jobs", e);
      }
    };
    fetchSaved();
  }, [dispatch]);

  const toggleBookmark = async () => {
    try {
      setLoading(true);
      if (isBookmarked) {
        await axios.delete(`${APPLICATION_API_END_POINT}/save/${jobId}`, {
          withCredentials: true,
        });
        dispatch(removeSavedJob(jobId));
        notifications.show({
          title: "Removed from Saved",
          message: "Job removed from your saved list.",
          color: "red",
        });
      } else {
        await axios.post(`${APPLICATION_API_END_POINT}/save/${jobId}`, {}, {
          withCredentials: true,
        });
        dispatch(addSavedJob(jobId));
        notifications.show({
          title: "Job Saved",
          message: "Job successfully saved to your list.",
          color: "teal",
        });
      }
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err?.response?.data?.message || "Failed to update saved jobs",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip label={isBookmarked ? "Unsave Job" : "Save Job"}>
      <ActionIcon
        onClick={toggleBookmark}
        variant="light"
        color={isBookmarked ? "pomegranate.5" : "gray"}
        loading={loading}
        size="lg"
        radius="xl"
      >
        {isBookmarked ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
      </ActionIcon>
    </Tooltip>
  );
};

export default BookmarkButton;
