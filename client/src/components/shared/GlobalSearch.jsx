import { useState, useEffect } from 'react';
import { TextInput, Paper, Avatar, Badge, Loader } from '@mantine/core';
import { FaSearch, FaBriefcase, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT, USER_API_END_POINT } from '../../utils/constant';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ jobs: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setResults({ jobs: [], users: [] });
      setShowResults(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const [jobsRes, usersRes] = await Promise.all([
          axios.get(`${JOB_API_END_POINT}/search?q=${query}`, { withCredentials: true }),
          axios.get(`${USER_API_END_POINT}/user/search?q=${query}`, { withCredentials: true })
        ]);
        
        setResults({
          jobs: (jobsRes.data.success ? jobsRes.data.jobs : [])?.slice(0, 3) || [],
          users: (usersRes.data.success ? usersRes.data.users : [])?.slice(0, 3) || []
        });
        setShowResults(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
    setShowResults(false);
    setQuery('');
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-md">
      <TextInput
        placeholder="Search jobs, people..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftSection={<FaSearch size={16} />}
        rightSection={loading && <Loader size={16} />}
        onFocus={() => query.length >= 2 && setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
      />
      
      {showResults && (results.jobs.length > 0 || results.users.length > 0) && (
        <Paper className="absolute top-full left-0 right-0 mt-1 p-2 shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.jobs.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                <FaBriefcase size={12} /> JOBS
              </p>
              {results.jobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => handleJobClick(job._id)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.company?.name} • {job.location}</p>
                  </div>
                  <Badge size="xs" color="blue">{job.type}</Badge>
                </div>
              ))}
            </div>
          )}
          
          {results.users.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                <FaUser size={12} /> PEOPLE
              </p>
              {results.users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                >
                  <Avatar size={32} src={user.profilePic} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.fullname}</p>
                    <p className="text-xs text-gray-500">{user.role} • {user.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Paper>
      )}
    </div>
  );
};

export default GlobalSearch;