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

    },
    {
      versionKey: false
    })
  ;

// Generate unique categoryId on new document creation
categorySchema.pre('validate', async function(next) {

  if (!this.isNew || this.categoryId) return next();
  
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
      const existingUser = await UserModel.findOne({ categoryId: candidateId });
      if (!existingUser) {
        this.categoryId = candidateId;
        isUnique = true;
      }
    } catch (err) {
      return next(err);
    }
    attempts++;
  }
  
  if (!isUnique)
    return next(new Error('Unable to generate unique categoryId after 10 attempts'));

  next();
});

// middleware
categorySchema.pre('save', function(next) {
  this.dateModified = new Date();
  next();
});

// Create the model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;