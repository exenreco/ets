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

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });


/**
 * ROUTE:       api/security/register-user
 * 
 * ENDPOINT:    register-user
 * 
 * METHOD:      POST
 * 
 * DESCRIPTION: Allows users to register with Athena's Expense Tracking System.
 * 
 * @Dev Exenreco Bell
 * 
 * @Date July 03, 2025
 * 
 */
router.post( '/register', async (req, res, next) => {

  try {

    const { email, firstName, lastName,  username, password } = req.body;
    
    // Basic input validation
    if ( ! firstName || ! lastName || ! username || ! email || ! password ) return next(
      createError( 400, 'All fields are required!')
    );

    // email checks
    if( ! emailRegex.test(email.toLowerCase().trim()) )return next(
      createError( 400, 'invalid email!')
    );

    // username checks
    if( ! usernameRegex.test(username.trim()) ) return next(
      createError( 400, 'invalid username!')
    );

    // password checks
    if( ! passwordRegex.test(password.trim()) ) return next(
      createError( 400, 'invalid password!')
    );

    const emailExists = Users.findOne({ email: email });

    if ( emailExists.email === email.toLowerCase().trim() ) return next( 
      createError( 400, 'invalid email, email already exists!')
    );

    const
      newUser = new Users({ // Create new users
        email:      email.toLowerCase().trim(),
        lastName:   lastName.trim(),
        username:   username.trim(),
        firstName:  firstName.trim(),
        password:   password.trim()
      }),

      savedUser = await newUser.save(), // Save user => Mongoose should handle schema requirements
  
      userResponse = { // curate response => remove sensitive data
        email:          savedUser.email,
        userId:         savedUser.userId,
        lastName:       savedUser.lastName,
        username:       savedUser.username,
        firstName:      savedUser.firstName,
        dateCreated:    savedUser.dateCreated
      }
    ;

    res.status(201).json({
      user: userResponse,
      message: `Welcome to the Expense tracking system ${userResponse.username}`
    });
      
  } catch (err) {

    if ( err instanceof mongoose.Error.ValidationError ) { // Handle validation errors

      const errors = {};

      Object.keys(err.errors).forEach(key => {
        errors[key] = err.errors[key].message;
      });

      return res.status(400).json({ errors });
    }
    
    if (err.code === 11000) { // Handle duplicate key errors

      const field = Object.keys(err.keyPattern)[0];

      return res.status(409).json({
        error: `${field} already exists`
      });

    }

    console.error('Registration error:', err);

    return next(createError(500, 'Server error'));
  }
});



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