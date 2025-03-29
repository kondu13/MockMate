// src/components/Dashboard/FilterUsers.jsx
import { useState } from 'react';

export default function FilterUsers({ onFilter }) {
  const [filters, setFilters] = useState({
    skills: '',
    experienceLevel: '',
    date: '',
    time: ''
  });

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
      skills: '',
      experienceLevel: '',
      date: '',
      time: ''
    });
    onFilter({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold mb-4">Filter Users</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Skills</label>
            <input
              type="text"
              name="skills"
              className="w-full px-3 py-2 border rounded"
              value={filters.skills}
              onChange={handleChange}
              placeholder="e.g. JavaScript, React"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Experience</label>
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
            <label className="block text-gray-700 text-sm mb-1">Date</label>
            <input
              type="date"
              name="date"
              className="w-full px-3 py-2 border rounded"
              value={filters.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Time</label>
            <select
              name="time"
              className="w-full px-3 py-2 border rounded"
              value={filters.time}
              onChange={handleChange}
              disabled={!filters.date}
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
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
}