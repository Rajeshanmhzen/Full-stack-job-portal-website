import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Button, Avatar, Group, Text, Stack, Divider, Paper } from '@mantine/core';
import { IconArrowLeft, IconDownload, IconCheck, IconX, IconClock } from '@tabler/icons-react';
import axios from 'axios';
import { APPLICATION_API_END_POINT, SERVER_BASE_URL } from '../../utils/constant';

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    applied: 'blue',
    inProgress: 'yellow',
    offered: 'green',
    rejected: 'red'
  };

  useEffect(() => {
    fetchApplicationDetail();
  }, [applicationId]);

  const fetchApplicationDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${APPLICATION_API_END_POINT}/recruiter/${applicationId}`, {
        withCredentials: true
      });
      setApplication(response.data.application);
    } catch (error) {
      console.error('Error fetching application detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (newStatus) => {
    try {
      await axios.put(`${APPLICATION_API_END_POINT}/status/${applicationId}`, {
        status: newStatus
      }, { withCredentials: true });
      
      setApplication(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const downloadResume = async () => {
    try {
      const response = await axios.get(`${APPLICATION_API_END_POINT}/resume/${application.applicant._id}`, {
        withCredentials: true,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${application.applicant.fullname}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!application) {
    return <div className="text-center py-12">Application not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="light"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/applications')}
          className="mb-4"
        >
          Back to Applications
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Application Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card shadow="sm" padding="lg" className="mb-6">
            <div className="flex items-start gap-4">
              <Avatar
                src={application.applicant.profile?.profilePhoto ? 
                  `${SERVER_BASE_URL}/uploads/user-profiles/${application.applicant.profile.profilePhoto}` : 
                  null
                }
                alt={application.applicant.fullname}
                size="xl"
              />
              
              <div className="flex-1">
                <Group justify="space-between" mb="xs">
                  <div>
                    <Text size="xl" fw={700}>{application.applicant.fullname}</Text>
                    <Text size="md" color="dimmed">{application.applicant.email}</Text>
                    <Text size="sm" color="dimmed">{application.applicant.phoneNumber}</Text>
                  </div>
                  <Badge color={statusColors[application.status]} size="lg" variant="light">
                    {application.status}
                  </Badge>
                </Group>
                
                {application.applicant.profile?.bio && (
                  <Paper p="md" bg="gray.0" className="mt-4">
                    <Text size="sm" fw={500} mb="xs">Bio</Text>
                    <Text size="sm">{application.applicant.profile.bio}</Text>
                  </Paper>
                )}
              </div>
            </div>
          </Card>

          <Card shadow="sm" padding="lg" className="mb-6">
            <Text size="lg" fw={600} mb="md">Applied Position</Text>
            <div className="space-y-2">
              <Text size="md" fw={500}>{application.job.title}</Text>
              <Text size="sm" color="dimmed">
                Company: {application.job.company?.name || 'N/A'}
              </Text>
              <Text size="sm" color="dimmed">
                Location: {application.job.location}
              </Text>
              <Text size="sm" color="dimmed">
                Salary: {application.job.salary ? `$${application.job.salary.toLocaleString()}` : 'Not specified'}
              </Text>
              <Text size="sm" color="dimmed">
                Type: {application.job.type}
              </Text>
            </div>
          </Card>

          {application.applicant.resume && (
            <Card shadow="sm" padding="lg" className="mb-6">
              <Text size="lg" fw={600} mb="md">Resume & Skills</Text>
              
              {application.applicant.resume.skills && (
                <div className="mb-4">
                  <Text size="sm" fw={500} mb="xs">Skills</Text>
                  <div className="flex flex-wrap gap-2">
                    {application.applicant.resume.skills.map((skill, index) => (
                      <Badge key={index} variant="light" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {application.applicant.resume.experience && (
                <div className="mb-4">
                  <Text size="sm" fw={500} mb="xs">Experience</Text>
                  <Text size="sm">{application.applicant.resume.experience}</Text>
                </div>
              )}

              {application.applicant.resume.education && (
                <div className="mb-4">
                  <Text size="sm" fw={500} mb="xs">Education</Text>
                  <Text size="sm">{application.applicant.resume.education}</Text>
                </div>
              )}

              <Button
                leftSection={<IconDownload size={16} />}
                onClick={downloadResume}
                variant="light"
              >
                Download Resume
              </Button>
            </Card>
          )}
        </div>

        <div>
          <Card shadow="sm" padding="lg" className="mb-6">
            <Text size="lg" fw={600} mb="md">Actions</Text>
            <Stack gap="sm">
              {application.status === 'applied' && (
                <>
                  <Button
                    color="green"
                    leftSection={<IconCheck size={16} />}
                    onClick={() => updateApplicationStatus('inProgress')}
                    fullWidth
                  >
                    Move to In Progress
                  </Button>
                  <Button
                    color="red"
                    variant="light"
                    leftSection={<IconX size={16} />}
                    onClick={() => updateApplicationStatus('rejected')}
                    fullWidth
                  >
                    Reject Application
                  </Button>
                </>
              )}
              
              {application.status === 'inProgress' && (
                <>
                  <Button
                    color="blue"
                    leftSection={<IconCheck size={16} />}
                    onClick={() => updateApplicationStatus('offered')}
                    fullWidth
                  >
                    Make Job Offer
                  </Button>
                  <Button
                    color="red"
                    variant="light"
                    leftSection={<IconX size={16} />}
                    onClick={() => updateApplicationStatus('rejected')}
                    fullWidth
                  >
                    Reject Application
                  </Button>
                </>
              )}

              {application.status === 'offered' && (
                <Button
                  color="red"
                  variant="light"
                  leftSection={<IconX size={16} />}
                  onClick={() => updateApplicationStatus('rejected')}
                  fullWidth
                >
                  Withdraw Offer
                </Button>
              )}
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg">
            <Text size="lg" fw={600} mb="md">Application Timeline</Text>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <Text size="sm" fw={500}>Application Submitted</Text>
                  <Text size="xs" color="dimmed">{formatDate(application.createdAt)}</Text>
                </div>
              </div>
              
              {application.updatedAt !== application.createdAt && (
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    application.status === 'offered' ? 'bg-green-500' :
                    application.status === 'inProgress' ? 'bg-yellow-500' :
                    application.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <Text size="sm" fw={500}>Status Updated</Text>
                    <Text size="xs" color="dimmed">{formatDate(application.updatedAt)}</Text>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;