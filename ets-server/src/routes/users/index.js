'use strict';

const // Requirements

    express = require('express'),

    router = express.Router(),

    Users = require('../../models/user'),

    createError = require('http-errors')
;


router.get('/', async (req, res, next) => {
    const endpointMsg = "Users endpoint is working.";
    res.send({ message: endpointMsg})
})

module.exports = router;