import { Avatar, Button, Card, Badge } from '@mantine/core';
import { useSelector } from 'react-redux';
import BookmarkButton from '../../components/shared/BookmarkButton';
import { useEffect, useState } from 'react';
import { APPLICATION_API_END_POINT, SERVER_BASE_URL } from '../../utils/constant';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useRecommendationUpdates from '../../hooks/useRecommendationUpdates';

const Recommendation = () => {
  const navigate = useNavigate();
  const { recommendations } = useSelector(store => store.resume);
  const [savedJobs, setSavedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const jobsPerPage = 6;
  
  // Use the hook for automatic updates
  useRecommendationUpdates();

  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/saved`, { withCredentials: true });
      setSavedJobs(res.data.savedJobs.filter(job => job && job.job).map(job => job.job._id));
    } catch (err) {
      console.error("Failed to fetch saved jobs", err);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    if (salary >= 100000) {
      return `NPR ${(salary / 100000).toFixed(1)}LPA`;
    }
    return `NPR ${salary.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Posted 1 day ago';
    if (diffDays < 30) return `Posted ${diffDays} days ago`;
    if (diffDays < 60) return 'Posted 1 month ago';
    return `Posted ${Math.floor(diffDays / 30)} months ago`;
  };

  const getCompanyAvatar = (companyName) => {
    const avatars = [
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&auto=format&fit=crop&w=2550&q=80",
    ];
    if (!companyName) return avatars[0];
    const index = companyName.length % avatars.length;
    return avatars[index];
  };

  console.log('Current recommendations:', recommendations);
  const filtered = recommendations.filter(r => r && r.job && r.score >= 0);
  const paginated = filtered.slice((page - 1) * jobsPerPage, page * jobsPerPage);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold text-gray-600 mb-2">No Recommendations Yet</h2>
        <p className="text-gray-500">Upload your resume to get personalized job recommendations</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {paginated.map((recommendation, index) => {
          if (!recommendation || !recommendation.job) {
            console.warn('Invalid recommendation:', recommendation);
            return null;
          }
          const job = recommendation.job;
          const companyName = job?.company?.name || 'Company';
          const companyLogo = job?.company?.logo 
            ? `${SERVER_BASE_URL}/uploads/company-logos/${job.company.logo}`
            : getCompanyAvatar(companyName);

          return (
            <Card
              key={job._id || index}
              shadow="sm"
              padding="xl"
              className="hover:shadow-md transition-shadow"
            >
              <div className='flex justify-between my-2'>
                <div className='flex gap-3 justify-center items-center'>
                  <Avatar 
                    src={companyLogo} 
                    alt={companyName} 
                    size="md"
                  />
                  <div>
                    <h3 className='font-bold text-xl'>{job.title || 'Job Title'}</h3>
                    <p className='text-mine-shaft-400'>
                      {companyName} • <span>{job.applications?.length || 0} Applicant{job.applications?.length !== 1 ? 's' : ''}</span>
                    </p>
                  </div>
                </div>
                <BookmarkButton jobId={job._id} />
              </div>
              <div className='flex gap-1.5 mt-1 flex-wrap'>
                {job.experienceLevel && (
                  <Button variant='light' color='purple-heart.5' size="xs">
                    {job.experienceLevel}
                  </Button>
                )}
                {job.type && (
                  <Button variant='light' color='purple-heart.5' size="xs">
                    {job.type}
                  </Button>
                )}
                {job.location && (
                  <Button variant='light' color='purple-heart.5' size="xs">
                    {job.location}
                  </Button>
                )}
              </div>

              <div className="my-4">
                <p className="text-sm text-mine-shaft-300 line-clamp-3">
                  {job.description || 'No description available for this position.'}
                </p>
              </div>

              <hr />

              <div>
                <div className='my-5 flex justify-between items-center'>
                  <p className='font-bold text-lg text-mine-shaft-300'>
                    {formatSalary(job.salary)}
                  </p>
                  <p className='text-mine-shaft-400 text-sm'>
                    {formatDate(job.createdAt)}
                  </p>
                </div>
                <Button 
                  fullWidth 
                  color='pomegranate.5'
                  onClick={() => navigate(`/job/${job._id}`)}
                >
                  View Job
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center mt-6 gap-4">
        {Array.from({ length: Math.ceil(filtered.length / jobsPerPage) }, (_, i) => (
          <Button
            key={i}
            variant={page === i + 1 ? "filled" : "light"}
            color="purple-heart.5"
            size="sm"
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;