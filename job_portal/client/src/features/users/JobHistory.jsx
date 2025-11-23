import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { APPLICATION_API_END_POINT } from '../../utils/constant';
import { notifications } from '@mantine/notifications';

const JobHistory = () => {
  const [activeTab, setActiveTab] = useState('Applied');
  const [data, setData] = useState({
    applied: [],
    saved: [],
    offered: [],
    inProgress: [],
    rejected: []
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const tabs = [
    { name: 'Applied', key: 'applied' },
    { name: 'Saved', key: 'saved' },
    { name: 'Offered', key: 'offered' },
    { name: 'In Progress', key: 'inProgress' },
    { name: 'Rejected', key: 'rejected' }
  ];

  const fetchJobData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${APPLICATION_API_END_POINT}/status`, {
        withCredentials: true
      });
      if (res.data.success) {
        setData({
          applied: res.data.applied || [],
          saved: res.data.saved || [],
          offered: res.data.offered || [],
          inProgress: res.data.inProgress || [],
          rejected: res.data.rejected || []
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Something went wrong.',
        color: 'red',
        withBorder: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleRemoveSavedJob = async (jobId) => {
    try {
      const res = await axios.delete(`${APPLICATION_API_END_POINT}/save/${jobId}`, {
        withCredentials: true
      });
      if (res.data.success) {
        notifications.show({
          title: 'Removed',
          message: res.data.message || 'Job removed from saved.',
          color: 'green'
        });
        fetchJobData();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Something went wrong.',
        color: 'red'
      });
    }
  };

  const renderJobCard = (item, type, index) => {
    const job = item.job || {};
    const isApplication = type !== 'saved';

    return (
      <div
        key={item._id}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center rounded-md font-bold text-lg">
              {job?.company?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {index + 1}. {job?.title || 'Job Title'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{job?.company?.name || 'Company'}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.experienceLevel && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    {job.experienceLevel}
                  </span>
                )}
                {job.jobType && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {job.jobType}
                  </span>
                )}
                {job.location && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {job.location}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                {job.description || 'No description available.'}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Posted {formatDistanceToNow(new Date(item.createdAt))} ago
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col gap-2 items-end">
            {isApplication && (
              <span className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${
                item.status === 'applied'
                  ? 'bg-blue-100 text-blue-800'
                  : item.status === 'offered'
                  ? 'bg-green-100 text-green-800'
                  : item.status === 'in-progress'
                  ? 'bg-yellow-100 text-yellow-800'
                  : item.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </span>
            )}
            {type === 'saved' && (
              <button
                onClick={() => handleRemoveSavedJob(job._id)}
                className="text-sm text-yellow-600 hover:underline cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getCurrentTabData = () => {
    return data[tabs.find(tab => tab.name === activeTab)?.key] || [];
  };

  const currentData = getCurrentTabData();
  const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(currentData.length / itemsPerPage);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Job History</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all duration-200 ${
              activeTab === tab.name
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
      ) : currentData.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No jobs found in this category.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedData.map((item, index) =>
              renderJobCard(item, tabs.find(t => t.name === activeTab).key, (currentPage - 1) * itemsPerPage + index)
            )}
          </div>
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default JobHistory;
