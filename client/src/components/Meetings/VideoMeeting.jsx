// src/components/Meetings/VideoMeeting.jsx
export default function VideoMeeting({ meetingId }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Meeting Room</h2>
      <div className="bg-gray-200 rounded-lg p-8 text-center mb-4">
        <p className="text-lg">Video meeting would be displayed here</p>
        <p className="mt-2 text-gray-600">Meeting ID: {meetingId}</p>
      </div>
      <div className="flex justify-center space-x-4">
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          End Meeting
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Leave Meeting
        </button>
      </div>
    </div>
  );
}