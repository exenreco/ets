const 
    mongoose = require('mongoose'),
    
    { Schema } = mongoose,
    
    expenseSchema = new Schema({

        userId: { type: Number, required: true, index: true },

        expenseId: { type: Number, required: true, index: true },

        categoryId: { type: String, required: true, index: true },

        amount: { type: Number, required: true, min: 0.01, set: v => parseFloat(v).toFixed(2) },

        description: { type: String, required: true, trim: true, maxlength: 255 },

        date: { type: Date, required: true },

        dateCreated: { type: Date,  default: Date.now },

        dateModified: {  type: Date, default: Date.now  }
    },
    {
      versionKey: false
    })
;

// Update dateModified on every save
expenseSchema.pre('save', function(next) {
  this.dateModified = new Date();
  next();
});

// Generate unique expenseId on new document creation
expenseSchema.pre('validate', async function(next) {

  if (!this.isNew || this.expenseId) return next();
  
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
      const existingUser = await UserModel.findOne({ expenseId: candidateId });
      if (!existingUser) {
        this.expenseId = candidateId;
        isUnique = true;
      }
    } catch (err) {
      return next(err);
    }
    attempts++;
  }
  
  if (!isUnique)
    return next(new Error('Unable to generate unique expenseId after 10 attempts'));

  next();
});

// Create compound index for user+category queries
expenseSchema.index({ userId: 1, categoryId: 1 });

// Create compound index for user+expense queries
expenseSchema.index({ userId: 1, expenseId: 1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;