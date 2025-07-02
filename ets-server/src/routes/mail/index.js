'use strict';

const
    express = require('express'),
    router = express.Router(),
    createError = require('http-errors');

router.get('/', async (req, res, next) => {
    const endpointMsg = "mailing endpoint is working.";
    res.send({ message: endpointMsg})
});

module.exports = router;