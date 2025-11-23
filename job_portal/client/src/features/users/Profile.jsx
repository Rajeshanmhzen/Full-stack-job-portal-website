import { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_BASE_URL, USER_API_END_POINT } from '../../utils/constant';
import { Avatar, Badge, Loader, Button, TextInput, Textarea, NumberInput, Modal, FileInput, Group } from '@mantine/core';
import { FaEdit, FaPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { showSuccess, showError } from '../../utils/showNotification';

const Profile = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editData, setEditData] = useState({});
  const [profilePic, setProfilePic] = useState(null);

  const startEdit = (section, data = {}) => {
    setEditingSection(section);
    setEditData(data);
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditData({});
    setProfilePic(null);
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      if (editingSection === 'basic') {
        formData.append('fullname', editData.fullname || user.fullname);
        formData.append('email', editData.email || user.email);
        formData.append('location', editData.location || user.location);
        formData.append('experienceYears', editData.experienceYears || user.experienceYears);
        if (profilePic) formData.append('profilePic', profilePic);
      } else if (editingSection === 'skills') {
        formData.append('skills', editData.skills || user.skills?.join(',') || '');
      } else if (editingSection === 'experience') {
        formData.append('experience', JSON.stringify(editData.experience || user.experience || []));
      } else if (editingSection === 'certifications') {
        formData.append('certifications', JSON.stringify(editData.certifications || user.certifications || []));
      }

      const res = await axios.post(`${USER_API_END_POINT}/update-profile`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        showSuccess('Profile updated successfully!');
        cancelEdit();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center text-red-500">User not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4">
      <div className="relative h-48 rounded-lg overflow-hidden shadow">
        <img
          src={user.banner ? `${SERVER_BASE_URL}/uploads/user-profiles/${user.banner}` : "/default-banner.jpg"}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-[-40px] left-6">
          <Avatar
            src={user.profilePic ? `${SERVER_BASE_URL}/uploads/user-profiles/${user.profilePic}` : undefined}
            size={80}
            radius="xl"
            className="border-4 border-white"
          />
        </div>
      </div>

      <div className="mt-12 px-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{user.fullname}</h1>
            <p className="text-gray-500 text-sm">{user.role}</p>
            <div className="mt-2 flex gap-3 flex-wrap">
              <Badge color="gray">{user.location}</Badge>
              <Badge color="gray">{user.experienceYears} yrs experience</Badge>
            </div>
          </div>
          <Button
            leftIcon={<FaEdit />}
            variant="outline"
            size="sm"
            onClick={() => startEdit('basic', {
              fullname: user.fullname,
              email: user.email,
              location: user.location,
              experienceYears: user.experienceYears
            })}
          >
            Edit
          </Button>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Skills</h2>
            <Button
              leftIcon={<FaEdit />}
              variant="outline"
              size="xs"
              onClick={() => startEdit('skills', { skills: user.skills?.join(', ') || '' })}
            >
              Edit
            </Button>
          </div>
          {user.skills && user.skills.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {user.skills.map((skill, idx) => (
                <Badge key={idx} color="purple-heart.5">{skill}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No skills added yet</p>
          )}
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Experience</h2>
            <Button
              leftIcon={<FaEdit />}
              variant="outline"
              size="xs"
              onClick={() => startEdit('experience', { experience: user.experience || [] })}
            >
              Edit
            </Button>
          </div>
          {user.experience && user.experience.length > 0 ? (
            <div className="space-y-2">
              {user.experience.map((exp, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-md">{exp.role}</h3>
                    <p className="text-sm text-gray-400">{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <p className="text-sm text-gray-500">{exp.company}, {exp.location}</p>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No experience added yet</p>
          )}
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Certifications</h2>
            <Button
              leftIcon={<FaEdit />}
              variant="outline"
              size="xs"
              onClick={() => startEdit('certifications', { certifications: user.certifications || [] })}
            >
              Edit
            </Button>
          </div>
          {user.certifications && user.certifications.length > 0 ? (
            <div className="space-y-2">
              {user.certifications.map((cert, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded shadow-sm">
                  <h3 className="font-medium text-md">{cert.title}</h3>
                  <p className="text-sm text-gray-500">{cert.organization} • {cert.issueDate}</p>
                  {cert.certificateId && <p className="text-sm text-gray-400">ID: {cert.certificateId}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No certifications added yet</p>
          )}
        </div>
      </div>

      {/* Edit Modals */}
      <Modal opened={editingSection === 'basic'} onClose={cancelEdit} title="Edit Basic Information">
        <div className="space-y-4">
          <TextInput
            label="Full Name"
            value={editData.fullname || ''}
            onChange={(e) => setEditData({...editData, fullname: e.target.value})}
          />
          <TextInput
            label="Email"
            value={editData.email || ''}
            onChange={(e) => setEditData({...editData, email: e.target.value})}
          />
          <TextInput
            label="Location"
            value={editData.location || ''}
            onChange={(e) => setEditData({...editData, location: e.target.value})}
          />
          <NumberInput
            label="Years of Experience"
            value={editData.experienceYears || 0}
            onChange={(value) => setEditData({...editData, experienceYears: value})}
          />
          <FileInput
            label="Profile Picture"
            accept="image/*"
            onChange={setProfilePic}
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
            <Button onClick={saveEdit} loading={loading}>Save</Button>
          </Group>
        </div>
      </Modal>

      <Modal opened={editingSection === 'skills'} onClose={cancelEdit} title="Edit Skills">
        <div className="space-y-4">
          <Textarea
            label="Skills (comma separated)"
            value={editData.skills || ''}
            onChange={(e) => setEditData({...editData, skills: e.target.value})}
            placeholder="JavaScript, React, Node.js"
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
            <Button onClick={saveEdit} loading={loading}>Save</Button>
          </Group>
        </div>
      </Modal>

      <Modal opened={editingSection === 'experience'} onClose={cancelEdit} title="Edit Experience" size="lg">
        <div className="space-y-4">
          {editData.experience?.map((exp, idx) => (
            <div key={idx} className="border p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Experience {idx + 1}</h4>
                <Button
                  size="xs"
                  color="red"
                  onClick={() => setEditData({
                    ...editData,
                    experience: editData.experience.filter((_, i) => i !== idx)
                  })}
                >
                  <FaTrash />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  label="Role"
                  value={exp.role || ''}
                  onChange={(e) => {
                    const newExp = [...editData.experience];
                    newExp[idx] = {...newExp[idx], role: e.target.value};
                    setEditData({...editData, experience: newExp});
                  }}
                />
                <TextInput
                  label="Company"
                  value={exp.company || ''}
                  onChange={(e) => {
                    const newExp = [...editData.experience];
                    newExp[idx] = {...newExp[idx], company: e.target.value};
                    setEditData({...editData, experience: newExp});
                  }}
                />
                <TextInput
                  label="Location"
                  value={exp.location || ''}
                  onChange={(e) => {
                    const newExp = [...editData.experience];
                    newExp[idx] = {...newExp[idx], location: e.target.value};
                    setEditData({...editData, experience: newExp});
                  }}
                />
                <div className="grid grid-cols-2 gap-1">
                  <TextInput
                    label="Start Date"
                    value={exp.startDate || ''}
                    onChange={(e) => {
                      const newExp = [...editData.experience];
                      newExp[idx] = {...newExp[idx], startDate: e.target.value};
                      setEditData({...editData, experience: newExp});
                    }}
                  />
                  <TextInput
                    label="End Date"
                    value={exp.endDate || ''}
                    onChange={(e) => {
                      const newExp = [...editData.experience];
                      newExp[idx] = {...newExp[idx], endDate: e.target.value};
                      setEditData({...editData, experience: newExp});
                    }}
                  />
                </div>
              </div>
              <Textarea
                label="Description"
                value={exp.description || ''}
                onChange={(e) => {
                  const newExp = [...editData.experience];
                  newExp[idx] = {...newExp[idx], description: e.target.value};
                  setEditData({...editData, experience: newExp});
                }}
                className="mt-2"
              />
            </div>
          ))}
          <Button
            leftIcon={<FaPlus />}
            variant="outline"
            onClick={() => setEditData({
              ...editData,
              experience: [...(editData.experience || []), {
                role: '', company: '', location: '', description: '', startDate: '', endDate: ''
              }]
            })}
          >
            Add Experience
          </Button>
          <Group justify="flex-end">
            <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
            <Button onClick={saveEdit} loading={loading}>Save</Button>
          </Group>
        </div>
      </Modal>

      <Modal opened={editingSection === 'certifications'} onClose={cancelEdit} title="Edit Certifications" size="lg">
        <div className="space-y-4">
          {editData.certifications?.map((cert, idx) => (
            <div key={idx} className="border p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Certification {idx + 1}</h4>
                <Button
                  size="xs"
                  color="red"
                  onClick={() => setEditData({
                    ...editData,
                    certifications: editData.certifications.filter((_, i) => i !== idx)
                  })}
                >
                  <FaTrash />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  label="Title"
                  value={cert.title || ''}
                  onChange={(e) => {
                    const newCert = [...editData.certifications];
                    newCert[idx] = {...newCert[idx], title: e.target.value};
                    setEditData({...editData, certifications: newCert});
                  }}
                />
                <TextInput
                  label="Organization"
                  value={cert.organization || ''}
                  onChange={(e) => {
                    const newCert = [...editData.certifications];
                    newCert[idx] = {...newCert[idx], organization: e.target.value};
                    setEditData({...editData, certifications: newCert});
                  }}
                />
                <TextInput
                  label="Issue Date"
                  value={cert.issueDate || ''}
                  onChange={(e) => {
                    const newCert = [...editData.certifications];
                    newCert[idx] = {...newCert[idx], issueDate: e.target.value};
                    setEditData({...editData, certifications: newCert});
                  }}
                />
                <TextInput
                  label="Certificate ID"
                  value={cert.certificateId || ''}
                  onChange={(e) => {
                    const newCert = [...editData.certifications];
                    newCert[idx] = {...newCert[idx], certificateId: e.target.value};
                    setEditData({...editData, certifications: newCert});
                  }}
                />
              </div>
            </div>
          ))}
          <Button
            leftIcon={<FaPlus />}
            variant="outline"
            onClick={() => setEditData({
              ...editData,
              certifications: [...(editData.certifications || []), {
                title: '', organization: '', issueDate: '', certificateId: ''
              }]
            })}
          >
            Add Certification
          </Button>
          <Group justify="flex-end">
            <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
            <Button onClick={saveEdit} loading={loading}>Save</Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
