// JobDetails.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Badge, Button, Loader } from '@mantine/core';
import axios from 'axios';
import { JOB_API_END_POINT, SERVER_BASE_URL } from '../../utils/constant';
import { IoMdArrowRoundBack } from 'react-icons/io';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        setJob(res.data.job);
      } catch (err) {
        console.error("Failed to load job details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (salary >= 100000) return `NPR ${(salary / 100000).toFixed(1)} LPA`;
    return `NPR ${salary.toLocaleString()}`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader /></div>;
  }

  if (!job) {
    return <div className="text-center text-red-600 mt-10">Job not found.</div>;
  }

  const companyName = job.company?.name || 'Company';
  const companyLogo = job.company?.logo
    ? `${SERVER_BASE_URL}/uploads/company-logos/${job.company.logo}`
    : null;

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-purple-700 shadow rounded">
        <Button
                  leftSection={<IoMdArrowRoundBack size={14} />}
                  variant="default"
                  mb="20"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
      <div className="flex gap-4 items-center mb-4">
        {companyLogo && <Avatar src={companyLogo} size="lg" alt={companyName} />}
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-mine-shaft-300">{companyName}</p>
        </div>
      </div>

      <div className="space-y-2 ">
        <div className='flex gap-3'>
        <Badge color="purple-heart.5">{job.type}</Badge>
        <Badge color="purple-heart.5">{job.location}</Badge>
        <Badge color="purple-heart.5">Experience: {job.experienceLevel}</Badge>
        </div>
        <p className="text-lg font-semibold">Salary: {formatSalary(job.salary)}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Job Description</h2>
        <p className="text-mine-shaft-300 whitespace-pre-line">{job.description}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Requirements</h2>
        <ul className="list-disc list-inside text-mine-shaft-300">
          {job.requirement?.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 text-right">
        <Button color="pomegranate.5">Apply Now</Button>
      </div>
    </div>
  );
};

export default JobDetails;
