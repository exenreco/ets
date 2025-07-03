const 

mongoose = require('mongoose'),

{ Schema } = mongoose,

bcrypt = require('bcrypt'),

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
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  }
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