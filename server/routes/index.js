import { Router } from 'express';
import { 
  register, 
  login, 
  logout 
} from '../controllers/auth.controller.js';
import { 
  getUserProfile, 
  updateUser, 
  deleteUser,
  getAllUsers,
  filterUsers
} from '../controllers/user.controller.js';
import {
  getAvailableSlots,
  bookAppointment,
  getUserAppointments, getAppointmentDetails, getScheduledInterviews
} from '../controllers/appointment.controller.js';

import { protect } from '../middleware/auth.js';

const router = Router();

// ======================
// Public Routes (No Auth)
// ======================
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// =====================
// Protected Routes (Auth Required)
// =====================
router.use(protect); // Applies to all routes below

// 1. User Profile Routes
router.route('/profile')
  .get(getUserProfile)
  .patch(updateUser)
  .delete(deleteUser);

// 2. User Discovery Routes
router.get('/users', getAllUsers);
router.get('/users/filter', filterUsers);

// 3. Appointment Routes
router.get('/users/:userId/availability/:date', getAvailableSlots);
router.post('/users/:userId/book', bookAppointment);
router.get('/appointments', getUserAppointments);
router.get('/appointments/:id', getAppointmentDetails);

// 4. Video Meeting Route (placeholder)
router.get('/scheduled-interviews/:id', (req, res) => {
  // This is a placeholder for video meeting functionality
  res.status(200).json({
    status: 'success',
    message: 'Video meeting would start here',
    meetingId: req.params.id
  });
});

router.get('/scheduled-interviews', getScheduledInterviews);

export default router;