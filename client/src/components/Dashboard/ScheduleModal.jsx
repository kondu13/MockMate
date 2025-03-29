import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAvailableSlots, 
  bookAppointment,
  getAppointmentDetails 
} from '../../services/api';

export default function ScheduleModal({ mentorId, mentorAvailability, onClose }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const _unused = availableSlots;
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  const getDayOfWeek = useCallback((dateString) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  }, []);

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const date = new Date(selectedDate).toISOString().split('T')[0];
      const slots = await getAvailableSlots(mentorId, date);
      setAvailableSlots(slots);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [mentorId, selectedDate]);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) {
      setError('Please select both date and time');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
      
      const appointment = await bookAppointment(mentorId, {
        date: formattedDate,
        time: selectedSlot
      });
      
      const details = await getAppointmentDetails(appointment._id);
      setAppointmentDetails(details);
      setSuccess('Appointment booked successfully!');
      
      setTimeout(() => {
        onClose();
        navigate('/meetings');
      }, 1500);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  const availableHours = (() => {
    if (!selectedDate) return [];
    const day = getDayOfWeek(selectedDate);
    const availability = mentorAvailability.find(a => a.day === day);
    return availability ? availability.hours : [];
  })();

  const noAvailableSlots = selectedDate && availableHours.length === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Schedule Appointment</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>

          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot('');
              }}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {selectedDate && (
            <>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Available Hours:</h3>
                {noAvailableSlots ? (
                  <div className="p-3 bg-yellow-50 text-yellow-700 rounded">
                    No available time slots for this date. Please select another day.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableHours.map(hour => (
                      <button
                        key={hour}
                        onClick={() => setSelectedSlot(hour)}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          selectedSlot === hour 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedSlot && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-700">
                    Selected time: <span className="font-medium">{selectedSlot}</span>
                  </p>
                </div>
              )}
            </>
          )}

          {appointmentDetails && (
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h4 className="font-bold">Appointment Confirmed:</h4>
              <p>Date: {new Date(appointmentDetails.date).toLocaleDateString()}</p>
              <p>Time: {appointmentDetails.time}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleBookAppointment}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading || !selectedDate || !selectedSlot || noAvailableSlots}
            >
              {isLoading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}