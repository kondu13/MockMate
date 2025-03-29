import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import { 
  getScheduledInterviews, 
  getAppointmentDetails 
} from '../services/api';
import MeetingsList from '../components/Meetings/MeetingsList';
import VideoMeeting from '../components/Meetings/VideoMeeting';

export default function Meetings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Memoized fetch functions
  const fetchMeetings = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getScheduledInterviews();
      setMeetings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMeetingDetails = useCallback(async (meetingId) => {
    setIsLoading(true);
    setError('');
    try {
      const meeting = await getAppointmentDetails(meetingId);
      setCurrentMeeting(meeting);
    } catch (err) {
      setError(err.message);
      navigate('/meetings');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  useEffect(() => {
    if (id) {
      fetchMeetingDetails(id);
    }
  }, [id, fetchMeetingDetails]);

  if (id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/meetings')}
          className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to meetings
        </button>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        ) : currentMeeting ? (
          <VideoMeeting 
            meeting={currentMeeting} 
            currentUserId={user?._id}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Scheduled Meetings</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      ) : (
        <MeetingsList 
          meetings={meetings} 
          currentUserId={user?._id}
        />
      )}
    </div>
  );
}