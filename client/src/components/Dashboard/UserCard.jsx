// src/components/Dashboard/UserCard.jsx
import { useState } from 'react';
import ScheduleModal from './ScheduleModal';

export default function UserCard({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">{user.username}</h3>
          <p className="text-gray-600 capitalize">{user.experienceLevel}</p>
          <div className="mt-2">
            <h4 className="font-medium">Skills:</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {user.skills.map(skill => (
                <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Schedule
        </button>
      </div>
      
      {isModalOpen && (
        <ScheduleModal 
          mentorId={user._id} 
          mentorAvailability={user.weeklyAvailability} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}