const 

  mongoose = require('mongoose'),

  { Schema } = mongoose,

  bcrypt = require('bcryptjs'),

  userSchema = new Schema({

    userId: { type: Number, required: true, unique: true, index: true },

    lastName: { type: String, required: true, trim: true, maxlength: 50 },

    firstName: { type: String, required: true, trim: true, maxlength: 50 },

    password: { type: String, required: true, minlength: 8 },

    dateCreated: { type: Date, default: Date.now },

    dateModified: { type: Date, default: Date.now },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
    },

    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address']
    }
  },
  {
    versionKey: false
  })
;

// Generate unique userId on new document creation
userSchema.pre('validate', async function(next) {

  if (!this.isNew || this.userId) return next();
  
  const
    UserModel = this.constructor,
    min = 1000000000, // 10-digit min => (1,000,000,000)
    max = 9999999999; // 10-digit max => (9,999,999,999)
  
  let 
    isUnique = false,
    attempts = 0;
  
  while (!isUnique && attempts < 10) {
    const candidateId = Math.floor(Math.random() * (max - min + 1)) + min;
    
    try {
      const existingUser = await UserModel.findOne({ userId: candidateId });
      if (!existingUser) {
        this.userId = candidateId;
        isUnique = true;
      }
    } catch (err) {
      return next(err);
    }
    attempts++;
  }
  
  if (!isUnique)
    return next(new Error('Unable to generate unique userId after 10 attempts'));

  next();
});

// Capitalize first letter of first and last name
userSchema.pre('save', function(next) {
  if (this.isModified('firstName') && typeof this.firstName === 'string') {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
  }

  if (this.isModified('lastName') && typeof this.lastName === 'string') {
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
  }

  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Update dateModified on save
userSchema.pre('save', function(next) {
  this.dateModified = new Date();
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;