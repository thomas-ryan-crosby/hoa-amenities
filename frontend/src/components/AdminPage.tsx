import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'resident' | 'janitorial' | 'admin';
  isActive: boolean;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'resident' | 'janitorial' | 'admin'>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUsers(response.data.users);
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      setActionLoading(userId);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/admin/users/${userId}/role`, {
        role: newRole
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole as any } : u
      ));
    } catch (error: any) {
      console.error('❌ Error updating user role:', error);
      setError(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      setActionLoading(userId);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/admin/users/${userId}/status`, {
        isActive: !isActive
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isActive: !isActive } : u
      ));
    } catch (error: any) {
      console.error('❌ Error updating user status:', error);
      setError(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#dc2626';
      case 'janitorial': return '#355B45';
      case 'resident': return '#059669';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#059669' : '#dc2626';
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          User Management
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '1rem'
      }}>
        {(['all', 'resident', 'janitorial', 'admin'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              backgroundColor: filter === filterType ? '#355B45' : '#f3f4f6',
              color: filter === filterType ? 'white' : '#374151',
              fontFamily: 'Inter, sans-serif',
              fontWeight: filter === filterType ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.875rem',
              textTransform: 'capitalize'
            }}
          >
            {filterType} ({filterType === 'all' ? users.length : users.filter(u => u.role === filterType).length})
          </button>
        ))}
      </div>

      {/* Users List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredUsers.map((userData) => (
          <div
            key={userData.id}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <span style={{
                    backgroundColor: getRoleColor(userData.role),
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    {userData.role}
                  </span>
                  <span style={{
                    backgroundColor: getStatusColor(userData.isActive),
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {userData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <div>📧 {userData.email}</div>
                  {userData.phone && <div>📞 {userData.phone}</div>}
                  {userData.address && <div>🏠 {userData.address}</div>}
                  <div>📅 Joined: {new Date(userData.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
                {/* Role Selection */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Role
                  </label>
                  <select
                    value={userData.role}
                    onChange={(e) => updateUserRole(userData.id, e.target.value)}
                    disabled={actionLoading === userData.id || userData.id === user?.id}
                    style={{
                      width: '100%',
                      padding: '0.375rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: userData.id === user?.id ? '#f9fafb' : 'white'
                    }}
                  >
                    <option value="resident">Resident</option>
                    <option value="janitorial">Janitorial</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Status Toggle */}
                <button
                  onClick={() => toggleUserStatus(userData.id, userData.isActive)}
                  disabled={actionLoading === userData.id || userData.id === user?.id}
                  style={{
                    padding: '0.375rem 0.75rem',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: userData.id === user?.id ? 'not-allowed' : 'pointer',
                    backgroundColor: userData.isActive ? '#dc2626' : '#059669',
                    color: 'white',
                    opacity: userData.id === user?.id ? 0.5 : 1
                  }}
                >
                  {actionLoading === userData.id ? 'Updating...' : 
                   userData.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</div>
          <div>No users found for the selected filter.</div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
