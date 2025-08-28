import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecommendations } from '../store/resumeSlice';
import { RESUME_API_END_POINT } from '../utils/constant';
import axios from 'axios';
import { showSuccess } from '../utils/showNotification';

const useRecommendationUpdates = () => {
  const dispatch = useDispatch();
  const { recommendations } = useSelector(store => store.resume);
  const previousCountRef = useRef(0);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(`${RESUME_API_END_POINT}/recommendations`, { withCredentials: true });
      if (res.data.success) {
        const newRecommendations = res.data.recommendations;
        
        if (previousCountRef.current > 0 && newRecommendations.length > previousCountRef.current) {
          const newCount = newRecommendations.length - previousCountRef.current;
          showSuccess(
            'New Job Recommendations!', 
            `Found ${newCount} new job${newCount > 1 ? 's' : ''} matching your profile`
          );
        }
        
        previousCountRef.current = newRecommendations.length;
        dispatch(setRecommendations(newRecommendations));
      }
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
    }
  };

  useEffect(() => {
    previousCountRef.current = recommendations.length;
    
    fetchRecommendations();
    const interval = setInterval(fetchRecommendations, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [dispatch]);

  return { refetchRecommendations: fetchRecommendations };
};

export default useRecommendationUpdates;