import { useState, useEffect } from 'react';
import {updateProfile} from '../../services/api';

const VALID_HOURS = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm'];

export default function ProfileForm({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    username: user.username,
    skills: user.skills || [],
    experienceLevel: user.experienceLevel || 'beginner',
    weeklyAvailability: user.weeklyAvailability || []
  });
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      username: user.username,
      skills: user.skills || [],
      experienceLevel: user.experienceLevel || 'beginner',
      weeklyAvailability: user.weeklyAvailability || []
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      if (formData.skills.length < 10) {
        setFormData({ ...formData, skills: [...formData.skills, newSkill] });
        setNewSkill('');
        setError('');
      } else {
        setError('Maximum 10 skills allowed');
      }
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const toggleHour = (day, hour) => {
    const updatedAvailability = formData.weeklyAvailability.map(d => {
      if (d.day === day) {
        const hours = d.hours.includes(hour) 
          ? d.hours.filter(h => h !== hour)
          : [...d.hours, hour];
        return { ...d, hours };
      }
      return d;
    });
    setFormData({ ...formData, weeklyAvailability: updatedAvailability });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validate at least one hour is selected
      const hasAvailability = formData.weeklyAvailability.some(
        day => day.hours && day.hours.length > 0
      );
      
      if (!hasAvailability) {
        throw new Error('Please select at least one available hour');
      }

      if (formData.skills.length === 0) {
        throw new Error('Please add at least one skill');
      }

      // Filter out empty availability days
      const filteredAvailability = formData.weeklyAvailability.filter(
        day => day.hours && day.hours.length > 0
      );

      // Connect with backend
      const updatedUser = await updateProfile({
        username: formData.username,
        skills: formData.skills,
        experienceLevel: formData.experienceLevel,
        weeklyAvailability: filteredAvailability
      });

      setSuccess('Profile updated successfully!');
      onUpdate(updatedUser);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize weekly availability if empty
  const weeklyAvailability = formData.weeklyAvailability.length > 0 
    ? formData.weeklyAvailability 
    : [
        { day: 'monday', hours: [] },
        { day: 'tuesday', hours: [] },
        { day: 'wednesday', hours: [] },
        { day: 'thursday', hours: [] },
        { day: 'friday', hours: [] },
        { day: 'saturday', hours: [] },
        { day: 'sunday', hours: [] }
      ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-3 py-2 border rounded"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={30}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded bg-gray-100"
            value={user.email}
            readOnly
            disabled
          />
          <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Skills (1-10)</label>
          <div className="flex mb-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-l"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              disabled={!newSkill || isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-gray-400"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span key={skill} className="bg-gray-200 px-3 py-1 rounded-full flex items-center">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-red-500"
                  aria-label={`Remove ${skill}`}
                  disabled={isLoading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Experience Level</label>
          <select
            name="experienceLevel"
            className="w-full px-3 py-2 border rounded"
            value={formData.experienceLevel}
            onChange={handleChange}
            required
            disabled={isLoading}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="professional">Professional</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Weekly Availability</label>
          <p className="text-sm text-gray-500 mb-2">
            Select your available hours (at least one required)
          </p>
          <div className="space-y-4">
            {weeklyAvailability.map((day) => (
              <div key={day.day}>
                <h3 className="font-medium capitalize">{day.day}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                  {VALID_HOURS.map((hour) => (
                    <button
                      type="button"
                      key={`${day.day}-${hour}`}
                      onClick={() => toggleHour(day.day, hour)}
                      disabled={isLoading}
                      className={`px-2 py-1 text-sm rounded ${
                        day.hours?.includes(hour)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading || formData.skills.length === 0}
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}