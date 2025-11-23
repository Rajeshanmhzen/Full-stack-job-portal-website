import { useState, useEffect } from 'react';
import { TextInput, Button, Card, Textarea, NumberInput, FileInput, Group } from '@mantine/core';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';
import { setUser } from '../../store/userSlice';
import { showSuccess, showError } from '../../utils/showNotification';

const EditProfile = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: '',
    email: '',
    location: '',
    skills: [],
    experienceYears: 0,
    experience: [],
    certifications: []
  });
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullname: user.fullname || '',
        email: user.email || '',
        location: user.location || '',
        skills: user.skills || [],
        experienceYears: user.experienceYears || 0,
        experience: user.experience || [],
        certifications: user.certifications || []
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (value) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setProfileData(prev => ({ ...prev, skills: skillsArray }));
  };

  const addExperience = () => {
    setProfileData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        role: '',
        company: '',
        location: '',
        description: '',
        startDate: '',
        endDate: ''
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    setProfileData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        title: '',
        organization: '',
        issueDate: '',
        certificateId: ''
      }]
    }));
  };

  const updateCertification = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (index) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('fullname', profileData.fullname);
      formData.append('email', profileData.email);
      formData.append('location', profileData.location);
      formData.append('skills', profileData.skills.join(','));
      formData.append('experienceYears', profileData.experienceYears);
      formData.append('experience', JSON.stringify(profileData.experience));
      formData.append('certifications', JSON.stringify(profileData.certifications));
      
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      const res = await axios.post(`${USER_API_END_POINT}/update-profile`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        showSuccess('Profile updated successfully!');
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-heart-500 mb-6">Edit Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card padding="lg">
          <h3 className="font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Full Name"
              value={profileData.fullname}
              onChange={(e) => handleInputChange('fullname', e.target.value)}
              required
            />
            <TextInput
              label="Email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
            <TextInput
              label="Location"
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
            <NumberInput
              label="Years of Experience"
              value={profileData.experienceYears}
              onChange={(value) => handleInputChange('experienceYears', value)}
              min={0}
            />
          </div>
          
          <Textarea
            label="Skills (comma separated)"
            value={profileData.skills.join(', ')}
            onChange={(e) => handleSkillsChange(e.target.value)}
            className="mt-4"
          />
          
          <FileInput
            label="Profile Picture"
            accept="image/*"
            onChange={setProfilePic}
            className="mt-4"
          />
        </Card>

        <Card padding="lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Experience</h3>
            <Button leftIcon={<FaPlus />} onClick={addExperience} size="sm">
              Add Experience
            </Button>
          </div>
          
          {profileData.experience.map((exp, index) => (
            <Card key={index} className="mb-4 p-4 border">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Experience {index + 1}</h4>
                <Button
                  color="red"
                  variant="light"
                  size="xs"
                  onClick={() => removeExperience(index)}
                >
                  <FaTrash />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Role"
                  value={exp.role}
                  onChange={(e) => updateExperience(index, 'role', e.target.value)}
                />
                <TextInput
                  label="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />
                <TextInput
                  label="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <TextInput
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                  />
                  <TextInput
                    label="End Date"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                  />
                </div>
              </div>
              
              <Textarea
                label="Description"
                value={exp.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                className="mt-4"
              />
            </Card>
          ))}
        </Card>

        <Card padding="lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Certifications</h3>
            <Button leftIcon={<FaPlus />} onClick={addCertification} size="sm">
              Add Certification
            </Button>
          </div>
          
          {profileData.certifications.map((cert, index) => (
            <Card key={index} className="mb-4 p-4 border">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Certification {index + 1}</h4>
                <Button
                  color="red"
                  variant="light"
                  size="xs"
                  onClick={() => removeCertification(index)}
                >
                  <FaTrash />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Title"
                  value={cert.title}
                  onChange={(e) => updateCertification(index, 'title', e.target.value)}
                />
                <TextInput
                  label="Organization"
                  value={cert.organization}
                  onChange={(e) => updateCertification(index, 'organization', e.target.value)}
                />
                <TextInput
                  label="Issue Date"
                  value={cert.issueDate}
                  onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
                />
                <TextInput
                  label="Certificate ID"
                  value={cert.certificateId}
                  onChange={(e) => updateCertification(index, 'certificateId', e.target.value)}
                />
              </div>
            </Card>
          ))}
        </Card>

        <Group justify="center">
          <Button
            type="submit"
            leftIcon={<FaSave />}
            loading={loading}
            size="lg"
          >
            Save Profile
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default EditProfile;