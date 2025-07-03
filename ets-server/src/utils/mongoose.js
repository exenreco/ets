/**
 * Title: mongoose.js
 * Author: Exenreco Bell
 * Date: July 2, 2025
 */

'use strict'

const 
  setting = {
    username: 'etsApp', // This is the username for the database
    password: 's3cret', // This is the password for the database
    name: 'expenseTrackingSystem' // This is the name of the database in MongoDB
  },
  config = {
    port: 3000, // This is the default port for MongoDB
    dbUrl: `mongodb+srv://${setting.username}:${setting.password}@bellevueuniversity.3mpby.mongodb.net/${setting.name}?retryWrites=true&w=majority`,
    dbname: setting.name // This is the name of the database in MongoDB
  },
  mongoose = require('mongoose')
;

// Connect to MongoDB
mongoose.connect(config.dbUrl, {});

// Get connection reference
const db = mongoose.connection;

// Connection events
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Export connection
module.exports = db;