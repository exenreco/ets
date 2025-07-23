/**
 * Title: mongoose.js
 * Author: Exenreco Bell
 * Date: July 2, 2025
 */

'use strict'

const 

  // Load environment variables from server/.env
  dotenv = require('dotenv'),

  path = require('path'),

  mongoose = require('mongoose')
;

dotenv.config({
  path: path.join(__dirname, '../.env'),
  quiet: (process.env.NODE_ENV !== 'test')? false : true
});

const createConnectionString = () => {
  const
    user      = process.env.DB_USER || 'etsApp',
    dbName    = process.env.DB_NAME || 'expenseTrackingSystem',
    cluster   = process.env.DB_CLUSTER || 'bellevueuniversity.3mpby.mongodb.net',
    password  = process.env.DB_PASSWORD || 's3cret'; 
  ;
  return `mongodb+srv://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;
};


// Connect to MongoDB
mongoose.connect(createConnectionString(), {});

// Get connection reference
const db = mongoose.connection;

// Connection events
db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', () => 
  // Log success message if not in test environment
  (process.env.NODE_ENV !== 'test')
  ? console.log('Connected to MongoDB successfully')
  : null
);

// Export connection
module.exports = db;