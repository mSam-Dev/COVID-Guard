const express = require('express')
const router = express.Router();
const BusinessOwner = require('../../../models/BusinessUser')
const authMiddleware = require('../../../middleware/auth');
const userType = require("../../../_constants/usertypes")
const {BadRequest} = require('../../../utils/errors')
const asyncHandler = require('express-async-handler')
const mongoose = require("mongoose");
const {ServerError} = require("../../../utils/errors");

/*
* @route   GET api/businessowner/profile
* @desc    Returns a registered general public users profile info
* @access  Private
*/

router.get('/profile', authMiddleware(userType.BUSINESS), asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Simple validation
    if (!userId) {
        throw new BadRequest('Please enter all fields');
    }

    // check id is valid
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new BadRequest('UserId is invalid');

    // Check for existing user
    const user = await BusinessOwner.findById(userId).select('-password');
    if (!user) throw new BadRequest('User does not exist');

    res.status(200).json({
        success: true,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        ABN: user.business.ABN,
        businessName: user.business.name,
    });
}));

/*
* @route   POST api/businessowner/profile
* @desc    Updates a registered general public users profile info
* @access  Private
*/

router.post('/profile', authMiddleware(userType.BUSINESS), asyncHandler(async (req, res) => {
    const { userId,  firstName, lastName, phone } = req.body;

    // Simple validation
    if (!userId || !firstName || !lastName) {
        throw new BadRequest('Please enter all fields');
    }

    // check id is valid
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new BadRequest('UserId is invalid');

    // Check for existing user
    const user = await BusinessOwner.findById(userId);
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