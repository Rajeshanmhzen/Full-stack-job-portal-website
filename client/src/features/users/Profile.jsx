import { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_BASE_URL, USER_API_END_POINT } from '../../utils/constant';
import { Avatar, Badge, Loader } from '@mantine/core';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${USER_API_END_POINT}/user/profile`, { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(err => console.error("Failed to fetch user details", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader /></div>;
  }

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
        <h1 className="text-2xl font-bold">{user.fullname}</h1>
        <p className="text-gray-500 text-sm">{user.role}</p>
        <div className="mt-2 flex gap-3 flex-wrap">
          <Badge color="gray">{user.location}</Badge>
          <Badge color="gray">{user.experienceYears} yrs experience</Badge>
        </div>

        {user.skills && user.skills.length > 0 && (
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Skills</h2>
            <div className="flex gap-2 flex-wrap">
              {user.skills.map((skill, idx) => (
                <Badge key={idx} color="purple-heart.5">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        {user.experience && user.experience.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Experience</h2>
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
          </div>
        )}

        {user.certifications && user.certifications.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Certifications</h2>
            <div className="space-y-2">
              {user.certifications.map((cert, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded shadow-sm">
                  <h3 className="font-medium text-md">{cert.title}</h3>
                  <p className="text-sm text-gray-500">{cert.organization} • {cert.issueDate}</p>
                  {cert.certificateId && <p className="text-sm text-gray-400">ID: {cert.certificateId}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
