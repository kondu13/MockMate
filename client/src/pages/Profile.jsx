import { useState, useEffect } from 'react';
import {useAuth} from '../hooks/useAuth';
import { getUserProfile, updateProfile } from '../services/api';
import ProfileForm from '../components/Profile/ProfileForm';

export default function Profile() {
  const { user: currentUser, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (updatedData) => {
    setIsLoading(true);
    setError('');
    try {
      const updatedProfile = await updateProfile(updatedData);
      setProfile(updatedProfile);
      setUser(updatedProfile); // Update auth context
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      {profile && (
        <ProfileForm 
          user={profile} 
          currentUser={currentUser}
          onUpdate={handleUpdate} 
          isLoading={isLoading}
        />
      )}
    </div>
  );
}