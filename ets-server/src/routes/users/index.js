'use strict';

const

    // Requirements

    express = require('express'),

    router = express.Router(),

    bcrypt = require('bcryptjs'),

    Users = require('../../models/user'),

    createError = require('http-errors'),


    // regex

    emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9_.~-]{8,}$/,

    usernameRegex = /^[a-zA-Z0-9_]+$/
;

// Fetch username by user id endpoint:
// Path: /api/users/:userId/username
router.get('/:userId/username', async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        if( ! userId ) return next(createError( 400, "Missing required param: userId" ));

        const user = await Users.findOne({userId: userId});

        if( user && user['username'] ) return res.json(user.username);
        
        else next(createError(  404, 'invalid, user not found!' ));
    } catch (err) {
        return next(createError(500, "Internal server error", { detail: err.message }));
    }
});

// Fetch user first name by user id endpoint:
// Path: /api/users/:userId/first-name
router.get('/:userId/first-name', async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        if( ! userId ) return next(createError( 400, "Missing required param: userId" ));

        const user = await Users.findOne({userId: userId});

        if( user && user['firstName'] ) return res.json(user.firstName);
        
        else next(createError(  404, 'invalid, user not found!' ));
    } catch (err) {
        return next(createError(500, "Internal server error", { detail: err.message }));
    }
});

// Fetch email by user id endpoint:
// Path: /api/users/:userId/email
router.get('/:userId/email', async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        if( ! userId ) return next(createError( 400, "Missing required param: userId" ));

        const user = await Users.findOne({userId: userId});

        if( user && user['email'] ) res.json(user.email);
        
        else return next(createError( 404, 'invalid, user not found!'));
    } catch (err) {
        return next(createError(500, "Internal server error", { detail: err.message }));
    }
});

// validates given user password
// path: /api/users/:userid?password=*******
router.get('/:userId', async (req, res, next) => {
    try {

        const 
            { userId } = req.params,
            { password } = req.query
        ;
        
        if( ! userId || ! password ) return next(
            createError(400, "missing required param: userId, password")
        );

        // userId must be an integer
        const userIdValue = parseInt(userId, 10); 
        if(isNaN(userIdValue)) return next(createError(
            400, "invalid user id type!"
        ));

        if(typeof password === 'string' && passwordRegex.test(password.trim())) {

            const user = await Users.findOne({ userId: userIdValue });

            if ( ! user ) return next(createError(401, 'invalid user')) 
            else {
                const isMatch = await user.comparePassword(password);
                if ( ! isMatch ) next(createError(404, 'invalid, password!'));
                // send back password when valid
                else return res.json( password );
            }

        } else return next(createError(404, 'invalid, password!'));

    } catch (err) {
        return next(createError(500, "Internal server error", err));
    }
});

// update a single user field
// patch:
router.patch('/:userId', async (req, res, next) => {
    try {
        const 
            { userId } = req.params,
            { field, before, after } = req.body
        ;

        if ( ! userId || ! field || ! before || ! after ) return next(
            createError(401, 'invalid request body')
        );

        // userId must be an integer
        const userIdValue = parseInt(userId, 10);
        if(isNaN(userIdValue)) return next(createError(400, "invalid user id type!"));

        // current password and new password must be of type string
        if( typeof after !== 'string' || typeof before !== 'string' ) return next(
            createError(401, 'an invalid change request was given!')
        );

        // only email, username or password field are allowed
        if( typeof field !== 'string' ) return next(
            createError(401, 'an invalid change request field type was given!')
        );

        // find send request user
        const user = await Users.findOne({ userId: userIdValue });

        // user not found
        if ( ! user ) return next(createError(401, 'invalid user'));

        if( field === 'email' ) { // patch user -> email

            const isMatch = ( user.email.toLowerCase() === before.toLowerCase() )
                ? true
                : false;

            if ( ! isMatch ) next( // current email does not match
                createError(404, 'email change failed, invalid current email.')
            ); else {
                // new email must match regex
                if(emailRegex.test(after.trim().toLowerCase())) {

                    const targetedUser = await Users.findOneAndUpdate(
                        { userId: userIdValue },
                        { email: after.trim().toLowerCase(), dateModified: new Date() },
                        { new: true, runValidators: true, context: 'query' }
                    ).select('-email -__v').lean();

                    if (! targetedUser ) return res.status(404).json({
                        error: 'User not found'
                    });

                    return res.json({ status: 200, email: targetedUser.email });
                }
                // invalid, regex not met
                else return next(createError(404, 'an invalid email was given!'));
            }

        } else if( field === 'username' ) { // patch user -> username

            const isMatch = (user.username.toLowerCase().trim() === before.toLowerCase().trim()) 
                ? true 
                : false;

            if ( ! isMatch ) next( // current username does not match
                createError(404, 'username change failed, invalid current username.')
            ); else {
                // new username must match regex
                if(usernameRegex.test(after.trim())) {

                    const targetedUser = await Users.findOneAndUpdate(
                        { userId: userIdValue },
                        { username: after.trim(), dateModified: new Date() },
                        { new: true, runValidators: true, context: 'query' }
                    ).select('-username -__v').lean();

                    if (! targetedUser ) return res.status(404).json({
                        error: 'User not found'
                    });

                    return res.json({ status: 200, username: targetedUser.username });
                }
                // invalid, regex not met
                else return next(createError(404, 'an invalid username was given!'));
            }

        } else if( field === 'password' ) { // patch user -> password

            const isMatch = await user.comparePassword(before);

            if ( ! isMatch ) next( // current password does not match
                createError(404, 'password change failed, invalid current password.')
            ); else {
                // new password must match regex
                if(passwordRegex.test(after.trim())) {

                    const 
                    salt            = await bcrypt.genSalt(10),
                    hashedPassword  = await bcrypt.hash(after.trim(), salt),
                    targetedUser    = await Users.findOneAndUpdate(
                        { userId: userIdValue },
                        { password: hashedPassword, dateModified: new Date() },
                        { new: true, runValidators: true, context: 'query' }
                    ).select('-password -__v').lean();

                    if (! targetedUser ) return res.status(404).json({
                        error: 'User not found'
                    });

                    return res.json({ status: 200, message: 'success' });
                }
                // invalid, regex not met
                else return next(createError(404, 'an invalid password was given!'));
            }

        } 
        
        else return next(createError(404, 'invalid change request!'));

    } catch (err) {
        return next(createError(500, "Internal server error", err));
    }
});

// PATCH:: resets a users password
router.patch('/:username', async (req, res, next) => {
    try {
        const 
        { username } = req.params,

        { email, password, confirmPassword } = req.body;

        if (!email || !username || !password || !confirmPassword) return res.status(400).json({ 
            message: 'Email, username, password & confirmPassword are all required.' 
        });

        if (password !== confirmPassword) return res.status(400).json({ 
            message: 'Password and confirm password do not match.'
        });

        if(typeof password !== 'string' || ! passwordRegex.test(password.trim()) ) return res.status(400).json({ 
            message: 'Invalid password given'
        });

        const 
            normalizedEmail = email.trim().toLowerCase(),
            normalizedUsername = username.trim(),
            user = await Users.findOne({
                email: normalizedEmail,
                username: normalizedUsername
            })
        ;

        if (!user) return res.status(404).json({ 
            message: 'No matching user found.' 
        });

        // Assign new password (pre-save hook will hash it)
        user.password = password;

        // Save & trigger hooks (e.g. password hash)
        await user.save();
        
        return res.status(200).json({ 
            message: 'Password has been reset successfully.'
        });

    } catch (err) {
        return next({ message: `500 Internal server error ${err}` });
    }
});

module.exports = router;