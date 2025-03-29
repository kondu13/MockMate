import User from '../models/user.model.js';

// get current user
export const getUserProfile = async (req, res) => {
  try {
    // The user is already attached to `req.user` by the `protect` middleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// update user
export const updateUser = async (req, res, next) => {
  try {
    // Prevent email updates (even if frontend tries to send it)
    if (req.body.email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email cannot be changed'
      });
    }

    // Filter allowed fields to update (exclude sensitive fields)
    const filteredBody = {
      username: req.body.username,
      skills: req.body.skills,
      experienceLevel: req.body.experienceLevel,
      weeklyAvailability: req.body.weeklyAvailability
    };

    // Update user (only changed fields via { new: true })
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      { new: true, runValidators: true } // Returns updated doc + runs schema validators
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    next(err);
  }
};

// delete user
export const deleteUser = async (req, res, next) => {
  try {
    // 1) Delete user
    await User.findByIdAndDelete(req.user.id);

    // 2) Clear JWT cookie (if using cookies)
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    // 3) Send confirmation
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

// fetch all users
export const getAllUsers = async (req, res) => {
  try {
    // Exclude current user from results
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password -__v');
    res.status(200).json({ status: 'success', data: users });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// filter users
export const filterUsers = async (req, res) => {
  try {
    const { skills, experienceLevel, date, time } = req.query;
    
    // Base query - exclude current user
    let query = { _id: { $ne: req.user._id } };
    
    // Skill filter - case insensitive
    if (skills) {
      const skillsArray = skills.split(',').map(skill => 
        new RegExp('^' + skill.trim() + '$', 'i')
      );
      query.skills = { $in: skillsArray };
    }
    
    // Experience level filter - case insensitive
    if (experienceLevel) {
      query.experienceLevel = new RegExp('^' + experienceLevel + '$', 'i');
    }
    
    // Date and time filter
    if (date && time) {
      const dayOfWeek = new Date(date).toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
      
      query['weeklyAvailability'] = {
        $elemMatch: {
          day: dayOfWeek,
          hours: time
        }
      };
    }
    
    const users = await User.find(query).select('-password -__v');
    
    res.status(200).json({ 
      status: 'success', 
      results: users.length,
      data: users 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
