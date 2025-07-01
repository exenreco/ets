'use strict';

const
    express = require('express'),
    router = express.Router(),
    { mongo } = require('../../utils/mongo');


router.get('/', async (req, res, next) => {
    const endpointMsg = "Security endpoint is working.";
    res.send({ message: endpointMsg})
})

module.exports = router;