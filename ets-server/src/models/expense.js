const 
    mongoose = require('mongoose'),
    
    { Schema } = mongoose,
    
    expenseSchema = new Schema({

        userId: { type: Number, required: true, index: true },

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

// Create compound index for user+category queries
expenseSchema.index({ userId: 1, categoryId: 1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;