import Appointment from '../models/appointment.model.js';

// Get available slots for a user
export const getAvailableSlots = async (req, res) => {
  try {
    const { userId, date } = req.params;
    
    // Get the target user's availability
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    // Get day of week from date
    const dayOfWeek = new Date(date).toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    
    // Find the availability for this day
    const dayAvailability = user.weeklyAvailability.find(day => day.day === dayOfWeek);
    
    if (!dayAvailability) {
      return res.status(200).json({
        status: 'success',
        data: {
          availableSlots: []
        }
      });
    }
    
    // Get existing appointments for this user on this date
    const existingAppointments = await Appointment.find({
      mentor: userId,
      date: new Date(date).setHours(0, 0, 0, 0)
    });
    
    // Filter out booked slots
    const availableSlots = dayAvailability.hours.filter(hour => {
      return !existingAppointments.some(appt => appt.time === hour);
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        availableSlots
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Book an appointment
export const bookAppointment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, time } = req.body;
    
    // Check if slot is still available
    const existingAppointment = await Appointment.findOne({
      mentor: userId,
      date: new Date(date).setHours(0, 0, 0, 0),
      time
    });
    
    if (existingAppointment) {
      return res.status(400).json({
        status: 'fail',
        message: 'This time slot is no longer available'
      });
    }
    
    // Create new appointment
    const appointment = await Appointment.create({
      mentor: userId,
      mentee: req.user.id,
      date: new Date(date).setHours(0, 0, 0, 0),
      time,
      status: 'scheduled'
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        appointment
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get user's appointments
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [
        { mentor: req.user.id },
        { mentee: req.user.id }
      ]
    })
    .populate('mentor', 'username skills experienceLevel')
    .populate('mentee', 'username skills experienceLevel');
    
    res.status(200).json({
      status: 'success',
      data: {
        appointments
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get single appointment details
export const getAppointmentDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('mentor', 'username skills experienceLevel')
      .populate('mentee', 'username skills experienceLevel');
    
    if (!appointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Appointment not found'
      });
    }
    
    // Check if current user is part of this appointment
    if (!appointment.mentor._id.equals(req.user.id) && !appointment.mentee._id.equals(req.user.id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to view this appointment'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        appointment
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getScheduledInterviews = async (req, res) => {
  try {
    const interviews = await Appointment.find({
      $or: [
        { mentor: req.user.id, status: 'scheduled' },
        { mentee: req.user.id, status: 'scheduled' }
      ]
    })
    .populate('mentor', 'username')
    .populate('mentee', 'username')
    .sort({ date: 1, time: 1 });
    
    res.status(200).json({
      status: 'success',
      data: {
        interviews
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};