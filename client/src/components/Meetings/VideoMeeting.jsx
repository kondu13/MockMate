// src/components/Meetings/VideoMeeting.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VideoMeeting({ meeting, currentUserId }) {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const handleEndMeeting = () => {
    navigate('/meetings');
  };

  // Determine the other person's username
  const otherPerson = meeting.mentor._id === currentUserId ? meeting.mentee : meeting.mentor;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Video Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Main Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">
                    {otherPerson.username[0].toUpperCase()}
                  </span>
                </div>
                <p className="text-lg font-medium">
                  {otherPerson.username}
                </p>
              </div>
            </div>
          </div>

          {/* Meeting Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Meeting Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Date:</span> {new Date(meeting.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Time:</span> {meeting.time}</p>
              <p><span className="font-medium">Status:</span> <span className="capitalize">{meeting.status}</span></p>
              <p><span className="font-medium">Experience Level:</span> <span className="capitalize">{meeting.mentor.experienceLevel}</span></p>
              <div className="mt-2">
                <p className="font-medium">Skills:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {meeting.mentor.skills.map(skill => (
                    <span key={skill} className="bg-blue-900 text-blue-200 px-2 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
          <div className="container mx-auto flex justify-center items-center space-x-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-80`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMuted ? "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" : "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"} />
              </svg>
            </button>
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-80`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isVideoOff ? "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" : "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"} />
              </svg>
            </button>
            <button
              onClick={handleEndMeeting}
              className="px-6 py-3 bg-red-500 rounded-full hover:bg-red-600 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>End Meeting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}