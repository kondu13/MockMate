import { getAllUsers, filterUsers } from '../services/api'; // Now properly imported
import { useCallback, useEffect, useState } from 'react';
import {useAuth} from '../hooks/useAuth';
import UserCard from '../components/Dashboard/UserCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Wrap fetchUsers in useCallback to prevent unnecessary recreations
  const fetchUsers = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError('');
    try {
      let data;
      if (Object.keys(filters).length === 0) {
        data = await getAllUsers();
      } else {
        data = await filterUsers(filters);
      }
      // Filter out current user
      setUsers(data.filter(u => u._id !== user?._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]); // Only recreate if user._id changes

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Now includes fetchUsers in dependencies

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
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
          No users found matching your criteria
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