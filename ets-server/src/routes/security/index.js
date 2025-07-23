'use strict';

const 

  // Requirements

  path = require('path'),

  dotenv = require('dotenv'),

  express = require('express'),

  router = express.Router(),

  jwt = require('jsonwebtoken'),

  mongoose = require('mongoose'),

  Users = require('../../models/user'),

  createError = require('http-errors'),

  // regex
  
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9_.~-]{8,}$/,

  usernameRegex = /^[a-zA-Z0-9_]+$/
;

/**
 * ROUTE:       api/security/signin
 * 
 * ENDPOINT:    Signin
 * 
 * METHOD:      POST
 * 
 * DESCRIPTION: Allows users to sign into Athena's Expense Tracking System.
 * 
 * @Dev Exenreco Bell, Sara Gorge
 * 
 * @Date July 02, 2025
 * 
 */
router.post( '/signin', async (req, res, next) => {

  try {

    const { username, password } = req.body;

    // Input validation
    if ( ! username || ! password ) return next(
      createError(400, 'Username and Password are required!')
    );

    // Find user
    const user = await Users.findOne({ username });
    if ( ! user ) return next(
      createError(401, 'Invalid credentials')
    );

    // Check password
    const isMatch = await user.comparePassword(password);
    if ( ! isMatch ) return next(
      createError(401, 'Invalid credentials')
    );

    // Successful authentication
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return res.json({ token: token, userId: user.userId, username: user.username });

  } catch (err) {

    if (createError.isHttpError(err)) return next(err);

    console.error('Signin error:', err);

    return next(createError(500, 'Server error'));
  }

});


module.exports = router;