import Recommendation from '../features/jobs/Recommendation';
import { useDispatch } from 'react-redux';
import { setRecommendations } from '../store/resumeSlice';
import { Button } from '@mantine/core';
import { FaSync } from 'react-icons/fa';
import axios from 'axios';
import { RESUME_API_END_POINT } from '../utils/constant';

const Recommendations = () => {
  const dispatch = useDispatch();
  
  const refreshRecommendations = async () => {
    try {
      const res = await axios.get(`${RESUME_API_END_POINT}/recommendations`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setRecommendations(res.data.recommendations));
      }
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-heart-500">Job Recommendations</h1>
        <Button
          leftIcon={<FaSync />}
          variant="light"
          color="blue"
          onClick={refreshRecommendations}
        >
          Refresh
        </Button>
      </div>
      <Recommendation />
    </div>
  );
};

export default Recommendations;