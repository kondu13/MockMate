// appointment.model.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Mentor is required']
  },
  mentee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Mentee is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent duplicate bookings
appointmentSchema.index({ mentor: 1, date: 1, time: 1 }, { unique: true });

// Populate mentor and mentee automatically
appointmentSchema.pre(/^find/, function(next) {
  this.populate('mentor').populate('mentee');
  next();
});

export default mongoose.model('Appointment', appointmentSchema);