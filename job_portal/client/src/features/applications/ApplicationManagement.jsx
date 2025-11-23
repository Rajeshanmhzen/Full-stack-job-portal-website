import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Select, TextInput, Avatar, Group, Text, Stack, Pagination } from '@mantine/core';
import { IconSearch, IconFilter, IconEye, IconCheck, IconX } from '@tabler/icons-react';
import axios from 'axios';
import { APPLICATION_API_END_POINT, SERVER_BASE_URL } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'applied', label: 'Applied' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'offered', label: 'Offered' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const statusColors = {
    applied: 'blue',
    inProgress: 'yellow',
    offered: 'green',
    rejected: 'red'
  };

  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, statusFilter, searchTerm, jobFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${APPLICATION_API_END_POINT}/recruiter/all`, {
        withCredentials: true
      });
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${APPLICATION_API_END_POINT}/recruiter/jobs`, {
        withCredentials: true
      });
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (jobFilter !== 'all') {
      filtered = filtered.filter(app => app.job._id === jobFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.applicant.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
    setCurrentPage(1);
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(`${APPLICATION_API_END_POINT}/status/${applicationId}`, {
        status: newStatus
      }, { withCredentials: true });
      
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Application Management</h1>
        <p className="text-gray-600">Manage and review job applications</p>
      </div>

      <Card className="mb-6" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextInput
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftSection={<IconSearch size={16} />}
          />
          
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            data={statusOptions}
            leftSection={<IconFilter size={16} />}
          />
          
          <Select
            placeholder="Filter by job"
            value={jobFilter}
            onChange={setJobFilter}
            data={[
              { value: 'all', label: 'All Jobs' },
              ...jobs.map(job => ({ value: job._id, label: job.title }))
            ]}
          />
          
          <Button onClick={() => {
            setStatusFilter('all');
            setSearchTerm('');
            setJobFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {paginatedApplications.length === 0 ? (
          <Card className="text-center py-12">
            <Text size="lg" color="dimmed">No applications found</Text>
          </Card>
        ) : (
          paginatedApplications.map((application) => (
            <Card key={application._id} shadow="sm" padding="lg">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  <Avatar
                    src={application.applicant.profile?.profilePhoto ? 
                      `${SERVER_BASE_URL}/uploads/user-profiles/${application.applicant.profile.profilePhoto}` : 
                      null
                    }
                    alt={application.applicant.fullname}
                    size="lg"
                  />
                  
                  <div className="flex-1">
                    <Group justify="space-between" mb="xs">
                      <div>
                        <Text size="lg" fw={600}>{application.applicant.fullname}</Text>
                        <Text size="sm" color="dimmed">{application.applicant.email}</Text>
                      </div>
                      <Badge color={statusColors[application.status]} variant="light">
                        {application.status}
                      </Badge>
                    </Group>
                    
                    <Text size="md" fw={500} mb="xs">
                      Applied for: {application.job.title}
                    </Text>
                    
                    <Text size="sm" color="dimmed" mb="md">
                      Company: {application.job.company?.name || 'N/A'} • 
                      Applied on: {formatDate(application.createdAt)}
                    </Text>
                    
                    {application.applicant.profile?.bio && (
                      <Text size="sm" color="dimmed" lineClamp={2}>
                        {application.applicant.profile.bio}
                      </Text>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="light"
                    leftSection={<IconEye size={16} />}
                    onClick={() => navigate(`/applications/${application._id}`)}
                  >
                    View
                  </Button>
                  
                  {application.status === 'applied' && (
                    <>
                      <Button
                        size="sm"
                        color="green"
                        leftSection={<IconCheck size={16} />}
                        onClick={() => updateApplicationStatus(application._id, 'inProgress')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        color="red"
                        variant="light"
                        leftSection={<IconX size={16} />}
                        onClick={() => updateApplicationStatus(application._id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {application.status === 'inProgress' && (
                    <Button
                      size="sm"
                      color="blue"
                      onClick={() => updateApplicationStatus(application._id, 'offered')}
                    >
                      Make Offer
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {filteredApplications.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={Math.ceil(filteredApplications.length / itemsPerPage)}
            size="sm"
          />
        </div>
      )}

      <Card className="mt-6" padding="lg">
        <Text size="lg" fw={600} mb="md">Application Summary</Text>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <Text size="xl" fw={700} color="blue">{applications.length}</Text>
            <Text size="sm" color="dimmed">Total</Text>
          </div>
          <div>
            <Text size="xl" fw={700} color="orange">
              {applications.filter(app => app.status === 'applied').length}
            </Text>
            <Text size="sm" color="dimmed">Applied</Text>
          </div>
          <div>
            <Text size="xl" fw={700} color="yellow">
              {applications.filter(app => app.status === 'inProgress').length}
            </Text>
            <Text size="sm" color="dimmed">In Progress</Text>
          </div>
          <div>
            <Text size="xl" fw={700} color="green">
              {applications.filter(app => app.status === 'offered').length}
            </Text>
            <Text size="sm" color="dimmed">Offered</Text>
          </div>
          <div>
            <Text size="xl" fw={700} color="red">
              {applications.filter(app => app.status === 'rejected').length}
            </Text>
            <Text size="sm" color="dimmed">Rejected</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationManagement;