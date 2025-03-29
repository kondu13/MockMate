// src/components/Auth/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/auth';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const validHours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm'];

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    skills: [],
    experienceLevel: '',
    weeklyAvailability: daysOfWeek.map(day => ({ day, hours: [] }))
  });
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill) && formData.skills.length < 10) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill('');
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
    try {
      // Filter out days with no hours selected
      const filteredAvailability = formData.weeklyAvailability.filter(day => day.hours.length > 0);
      
      if (filteredAvailability.length === 0) {
        setError('Please select at least one available hour');
        return;
      }

      await register({ ...formData, weeklyAvailability: filteredAvailability });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-3 py-2 border rounded"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="3"
              maxLength="30"
              pattern="[a-zA-Z0-9_]+"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border rounded"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />
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
              disabled={!newSkill || formData.skills.length >= 10}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-gray-400"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map(skill => (
              <span key={skill} className="bg-gray-200 px-3 py-1 rounded-full flex items-center">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-red-500"
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
          >
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="professional">Professional</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Weekly Availability</label>
          <p className="text-sm text-gray-500 mb-2">Select your available hours (at least one required)</p>
          <div className="space-y-4">
            {formData.weeklyAvailability.map((day) => (
              <div key={day.day}>
                <h3 className="font-medium capitalize">{day.day}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                  {validHours.map(hour => (
                    <button
                      type="button"
                      key={`${day.day}-${hour}`}
                      onClick={() => toggleHour(day.day, hour)}
                      className={`px-2 py-1 text-sm rounded ${day.hours.includes(hour) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={formData.skills.length === 0 || !formData.experienceLevel}
        >
          Register
        </button>
      </form>
    </div>
  );
}