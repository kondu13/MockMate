// src/components/Meetings/MeetingsList.jsx
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function MeetingsList({ meetings }) {
  return (
    <div className="space-y-4">
      {meetings.length === 0 ? (
        <p className="text-gray-500">No scheduled meetings</p>
      ) : (
        meetings.map(meeting => (
          <div key={meeting._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">
                  With: {meeting.mentor._id === meeting.currentUser ? meeting.mentee.username : meeting.mentor.username}
                </h3>
                <p className="text-gray-600">
                  {format(new Date(meeting.date), 'MMMM d, yyyy')} at {meeting.time}
                </p>
                <p className="capitalize mt-1">Status: {meeting.status}</p>
              </div>
              <Link
                to={`/meetings/${meeting._id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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