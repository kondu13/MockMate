// src/components/Meetings/MeetingsList.jsx
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function MeetingsList({ meetings, currentUserId }) {
  return (
    <div className="space-y-4">
      {meetings.length === 0 ? (
        <p className="text-gray-500">No scheduled meetings</p>
      ) : (
        meetings.map(meeting => (
          <div key={meeting._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold">
                  With: {meeting.mentor._id === currentUserId ? meeting.mentee.username : meeting.mentor.username}
                </h3>
                <p className="text-gray-600">
                  {format(new Date(meeting.date), 'MMMM d, yyyy')} at {meeting.time}
                </p>
                <p className="capitalize mt-1">Status: {meeting.status}</p>
                <p className="text-gray-600 capitalize mt-1">
                  Experience Level: {meeting.mentor.experienceLevel}
                </p>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {meeting.mentor.skills.map(skill => (
                      <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                to={`/meetings/${meeting._id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-4"
              >
                Join Meeting
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}