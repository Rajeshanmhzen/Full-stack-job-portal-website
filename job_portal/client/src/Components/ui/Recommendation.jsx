import { Avatar, Button, Card, Badge } from '@mantine/core';
import { useSelector } from 'react-redux';
import BookmarkButton from '../../Components/shared/BookmarkButton';

const Recommendation = () => {
  const { recommendations } = useSelector(store => store.resume);

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
      "https://images.unsplash.com/photo-1572021335469-31706a17aaef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2550&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2550&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2550&q=80"
    ];
    if (!companyName) return avatars[0];
    const index = companyName.length % avatars.length;
    return avatars[index];
  };

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-purple-heart-500 mb-2">Job Recommendations</h1>
        <p className="text-gray-600">Found {recommendations.length} jobs matching your profile</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {recommendations.filter(r => r.score >= 50).map((recommendation, index) => {
          const job = recommendation.job;

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
                    src={getCompanyAvatar(job.company)} 
                    alt={job.company || "Company"} 
                    size="md"
                  />
                  <div>
                    <h3 className='font-bold text-xl'>{job.title || 'Job Title'}</h3>
                    <p className='text-mine-shaft-400'>
                      {job.company || 'Company'} • <span>{job.applications?.length || 0} Applicant{job.applications?.length !== 1 ? 's' : ''}</span>
                    </p>
                  </div>
                </div>
                <BookmarkButton jobId={job._id} />
              </div>

              <div className="mb-3">
                <Badge 
                  variant="light" 
                  color={recommendation.score >= 80 ? 'green' : recommendation.score >= 60 ? 'yellow' : 'red'}
                  size="lg"
                >
                  {recommendation.score}% Match
                </Badge>
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
                  onClick={() => {
                    console.log('View job:', job._id);
                  }}
                >
                  View Job
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendation;
