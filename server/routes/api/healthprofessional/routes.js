const express = require('express')
const router = express.Router();
const HealthProfessional = require('../../../models/HealthProfessional');
const moment = require('moment');
const authMiddleware = require('../../../middleware/auth');
const userType = require("../../../_constants/usertypes")
const {BadRequest} = require('../../../utils/errors')
const asyncHandler = require('express-async-handler')
const mongoose = require("mongoose");
const {ServerError} = require("../../../utils/errors");

/*
* @route   GET api/healthprofessional/profile
* @desc    Returns a registered general public users profile info
* @access  Private
*/

router.get('/profile', authMiddleware(userType.HEALTH), asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Simple validation
    if (!userId) {
        throw new BadRequest('Please enter all fields');
    }

    // check id is valid
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new BadRequest('UserId is invalid');

    // Check for existing user
    const user = await HealthProfessional.findById(userId).select('-password');
    if (!user) throw new BadRequest('User does not exist');

    res.status(200).json({
        success: true,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        healthId: user.healthId
    });
}));

/*
* @route   POST api/healthprofessional/profile
* @desc    Updates a registered general public users profile info
* @access  Private
*/

router.post('/profile', authMiddleware(userType.HEALTH), asyncHandler(async (req, res) => {
    const { userId,  firstName, lastName, phone } = req.body;

    // Simple validation
    if (!userId || !firstName || !lastName) {
        throw new BadRequest('Please enter all fields');
    }

    // check id is valid
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new BadRequest('UserId is invalid');

    // Check for existing user
    const user = await HealthProfessional.findById(userId);
    if (!user) throw new BadRequest('User does not exist');

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;

    const newUser = await user.save();
    if (!newUser) throw new ServerError('Error updating user');

    res.status(200).json({
        success: true,
        userId: user.id
    });
}));

module.exports = router;