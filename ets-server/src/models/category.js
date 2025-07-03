const 

    mongoose = require('mongoose'), 

    { Schema } = mongoose,
    
    categorySchema = new Schema({

      userId: { type: Number, required: true, unique: true },

      name: { type: String, required: true, unique: true, trim: true },

      slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

      description: { type: String, default: '' },

      categoryId: { type: String, required: true, unique: true },

      dateCreated: { type: Date, default: Date.now },

      dateModified: { type: Date, default: Date.now }

    })
  ;

// middleware
categorySchema.pre('save', function(next) {
  this.dateModified = new Date();
  next();
});

// Create the model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;