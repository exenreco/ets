'use strict';

const // Requirements

    path = require('path'),

    dotenv = require('dotenv'),

    express = require('express'),

    router = express.Router(),

    bcrypt = require('bcryptjs'),

    jwt = require('jsonwebtoken'),

    mongoose = require('mongoose'),

    Users = require('../../models/user'),

    createError = require('http-errors')
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
router.post( '/register-user', async (req, res, next) => {

    try {

        const { email, firstName, lastName,  username, password } = req.body;
        
        // Basic input validation
        if ( ! firstName || ! lastName || ! username || ! email || ! password ) throw createError(
            400, 
            'All fields are required!'
        );

        const 

            newUser = new Users({ // Create new users
                email:      email.toLowerCase().trim(),
                lastName:   lastName.trim(),
                username:   username.trim(),
                firstName:  firstName.trim(),
                password:   password
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

        next(createError(500, 'Server error'));
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
    if ( ! username || ! password )
      throw createError(400, 'Username and Password are required!');

    // Find user
    const user = await Users.findOne({ username });
    if ( ! user )
      throw createError(401, 'Invalid credentials');

    // Check password
    const isMatch = await user.comparePassword(password);
    if ( ! isMatch )
      throw createError(401, 'Invalid credentials');

    // Successful authentication
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({ token: token, userId: user.userId, username: user.username });

  } catch (err) {

    if (createError.isHttpError(err))
      return next(err);

    console.error('Signin error:', err);

    next(createError(500, 'Server error'));

  }

});


module.exports = router;