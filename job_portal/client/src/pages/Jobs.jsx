import { useEffect, useState } from 'react';
import { Card, Button, Avatar, Badge } from '@mantine/core';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, SERVER_BASE_URL } from '../utils/constant';
import BookmarkButton from '../components/shared/BookmarkButton';

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([])
  const navigate = useNavigate();
   useEffect(() => {
    axios.get(`${APPLICATION_API_END_POINT}/saved`, { withCredentials: true })
      .then(res => setSavedJobs(res.data.savedJobs.map(job => job.job._id)))
      .catch(err => console.error("Failed to fetch saved jobs", err));
  }, []);

  useEffect(() => {
    axios.get(`${JOB_API_END_POINT}/get-job`, { withCredentials: true })
      .then(res => setJobs(res.data.jobs))
      .catch(err => console.error("Failed to fetch jobs", err));
  }, []);

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (salary >= 100000) return `NPR ${(salary / 100000).toFixed(1)} LPA`;
    return `NPR ${salary.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {jobs.map((job) => {
        const companyName = job.company?.name || 'Company';
        const companyLogo = job.company?.logo
          ? `${SERVER_BASE_URL}/uploads/company-logos/${job.company.logo}`
          : null;

        return (
          <Card key={job._id} shadow="sm" padding="lg">
            <div className='flex justify-between'>
            <div className="flex gap-3 items-center mb-3">
              <Avatar src={companyLogo} size="md" alt={companyName} />
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-sm text-gray-500">{companyName}</p>
              </div>
              </div>
              <BookmarkButton jobId={job._id} />
            </div>
            <div className='flex gap-2'>
            <Badge color="purple-heart.5" className="mb-2">{job.type}</Badge>
            <Badge color="purple-heart.5" className="mb-2">{job.location}</Badge>
            <Badge color="purple-heart.5" className="mb-2">{job.experienceLevel}</Badge>
            </div>
            <p className="text-sm line-clamp-3">{job.description}</p>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm font-bold">{formatSalary(job.salary)}</p>
              <Button size="xs" onClick={() => navigate(`/job/${job._id}`)} color='pomegranate.5'>
                View Details
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Job;
