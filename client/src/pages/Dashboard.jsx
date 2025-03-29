import { getAllUsers, filterUsers } from '../services/api';
import { useCallback, useEffect, useState } from 'react';
import {useAuth} from '../hooks/useAuth';
import UserCard from '../components/Dashboard/UserCard';
import FilterUsers from '../components/Dashboard/FilterUsers';

export default function Dashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasFilters, setHasFilters] = useState(false);

  const fetchUsers = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError('');
    try {
      let data;
      if (Object.keys(filters).length === 0) {
        data = await getAllUsers();
        setHasFilters(false);
      } else {
        // Only include non-empty filter values
        const validFilters = Object.entries(filters).reduce((acc, [key, value]) => {
          if (value && (Array.isArray(value) ? value.length > 0 : true)) {
            acc[key] = value;
          }
          return acc;
        }, {});
        
        data = await filterUsers(validFilters);
        setHasFilters(true);
      }
      
      // Handle different response formats
      const usersArray = Array.isArray(data) ? data : 
                        data?.users ? data.users : 
                        data?.data ? data.data : [];
      
      // Filter out current user and ensure we have valid user objects
      const filteredUsers = usersArray
        .filter(u => u && u._id && u._id !== user?._id)
        .map(u => ({
          ...u,
          skills: Array.isArray(u.skills) ? u.skills : [],
          weeklyAvailability: Array.isArray(u.weeklyAvailability) ? u.weeklyAvailability : []
        }));
      
      setUsers(filteredUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilter = (filters) => {
    fetchUsers(filters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Find Mentors</h1>
      
      <FilterUsers onFilter={handleFilter} />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasFilters ? 'No mentors found matching your criteria' : 'No mentors available yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {hasFilters 
              ? 'Try adjusting your filters to see more results'
              : 'Check back later to find mentors in your area'}
          </p>
          {hasFilters && (
            <button
              onClick={() => handleFilter({})}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <UserCard 
              key={user._id} 
              user={user} 
              currentUserId={user?._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}