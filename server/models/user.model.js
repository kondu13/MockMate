import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const experienceLevels = ['beginner', 'intermediate', 'advanced', 'professional'];
const validHours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm'];
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: daysOfWeek,
    required: [true, 'Day of week is required']
  },
  hours: [{
    type: String,
    enum: {
      values: validHours,
      message: '{VALUE} is not a valid hour. Use 8am-9pm format'
    },
    validate: {
      validator: function(hours) {
        return hours.length > 0;
      },
      message: 'At least one hour must be selected for each day'
    }
  }]
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: function(skills) {
        return skills.length > 0 && skills.length <= 10;
      },
      message: 'Please provide between 1-10 skills'
    }
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: {
      values: experienceLevels,
      message: `Must be one of: ${experienceLevels.join(', ')}`
    }
  },
  weeklyAvailability: {
    type: [availabilitySchema],
    required: [true, 'Weekly availability is required'],
    validate: {
      validator: function(availability) {
        // Check at least one day has hours
        const hasAvailability = availability.some(day => day.hours.length > 0);
        // Check no duplicate days
        const days = availability.map(a => a.day);
        const uniqueDays = new Set(days);
        return hasAvailability && (days.length === uniqueDays.size);
      },
      message: 'Select at least one available hour across non-duplicate days'
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);