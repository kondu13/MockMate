import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

export const register = async (req, res, next) => {
  try {
    // Validate at least one hour exists
    const availability = req.body.weeklyAvailability || [];
    const hasHours = availability.some(day => 
      day.hours && day.hours.length > 0
    );

    if (!hasHours) {
      return res.status(400).json({
        status: 'fail',
        message: 'You must select at least one available hour'
      });
    }

    // Filter out days with no hours
    const filteredAvailability = availability.filter(
      day => day.hours && day.hours.length > 0
    );

    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      skills: req.body.skills,
      experienceLevel: req.body.experienceLevel,
      weeklyAvailability: filteredAvailability
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        status: 'fail',
        message: `${field} '${err.keyValue[field]}' already exists`
      });
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  try {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });
    
    // Clear Authorization header
    res.removeHeader('Authorization');
    
    res.status(200).json({ 
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error during logout'
    });
  }
};
