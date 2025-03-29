// src/components/Dashboard/FilterUsers.jsx
import { useState } from 'react';

export default function FilterUsers({ onFilter }) {
  const [filters, setFilters] = useState({
    skills: [],
    experienceLevel: '',
    date: '',
    time: ''
  });
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill && !filters.skills.includes(newSkill) && filters.skills.length < 5) {
      setFilters({ ...filters, skills: [...filters.skills, newSkill] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFilters({ ...filters, skills: filters.skills.filter(s => s !== skill) });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      skills: [],
      experienceLevel: '',
      date: '',
      time: ''
    });
    onFilter({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Skills</label>
          <div className="flex mb-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-l"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill to filter"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              disabled={!newSkill || filters.skills.length >= 5}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-gray-400"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.skills.map(skill => (
              <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Experience Level</label>
          <select
            name="experienceLevel"
            className="w-full px-3 py-2 border rounded"
            value={filters.experienceLevel}
            onChange={handleChange}
          >
            <option value="">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="professional">Professional</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            className="w-full px-3 py-2 border rounded"
            value={filters.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Time</label>
          <select
            name="time"
            className="w-full px-3 py-2 border rounded"
            value={filters.time}
            onChange={handleChange}
          >
            <option value="">Any time</option>
            <option value="8am">8:00 AM</option>
            <option value="9am">9:00 AM</option>
            <option value="10am">10:00 AM</option>
            <option value="11am">11:00 AM</option>
            <option value="12pm">12:00 PM</option>
            <option value="1pm">1:00 PM</option>
            <option value="2pm">2:00 PM</option>
            <option value="3pm">3:00 PM</option>
            <option value="4pm">4:00 PM</option>
            <option value="5pm">5:00 PM</option>
            <option value="6pm">6:00 PM</option>
            <option value="7pm">7:00 PM</option>
            <option value="8pm">8:00 PM</option>
            <option value="9pm">9:00 PM</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}