import { useState } from 'react';
import { TextInput, Button, Card, Avatar, Badge, Select, Group } from '@mantine/core';
import { FaSearch, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT, SERVER_BASE_URL } from '../../utils/constant';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    location: ''
  });
  const navigate = useNavigate();

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchTerm,
        ...filters
      });
      
      const res = await axios.get(`${USER_API_END_POINT}/search?${params}`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-heart-500 mb-6">Search Users</h1>
      
      <Card className="mb-6" padding="lg">
        <Group>
          <TextInput
            placeholder="Search by name, skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
            style={{ flex: 1 }}
            leftSection={<FaSearch />}
          />
          
          <Select
            placeholder="Role"
            data={[
              { value: '', label: 'All Roles' },
              { value: 'worker', label: 'Job Seeker' },
              { value: 'recruiter', label: 'Recruiter' }
            ]}
            value={filters.role}
            onChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
          />
          
          <Button onClick={searchUsers} loading={loading}>
            Search
          </Button>
        </Group>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user._id} shadow="sm" padding="lg">
            <div className="flex items-center gap-4 mb-4">
              <Avatar
                src={user.profilePic ? `${SERVER_BASE_URL}/uploads/user-profiles/${user.profilePic}` : null}
                size="lg"
                radius="md"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{user.fullname}</h3>
                <Badge color={user.role === 'recruiter' ? 'blue' : 'green'} size="sm">
                  {user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">{user.location}</p>
              </div>
            </div>
            
            {user.skills && user.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {user.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="light" size="xs">
                      {skill}
                    </Badge>
                  ))}
                  {user.skills.length > 3 && (
                    <Badge variant="light" size="xs">
                      +{user.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            <Button
              fullWidth
              variant="light"
              leftIcon={<FaEye />}
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              View Profile
            </Button>
          </Card>
        ))}
      </div>
      
      {users.length === 0 && searchTerm && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;