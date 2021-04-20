const express = require('express')
const router = express.Router();
const HealthProfessionalUser = require('../../../models/HealthProfessional')
const faker = require('faker');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middleware/auth');
const userType = require("../../../_constants/usertypes")
const {BadRequest} = require('../../../utils/errors')
const asyncHandler = require('express-async-handler')
const {encryptPassword} = require("../../../utils/general");
const mongoose = require("mongoose");
const {Unauthorized} = require("../../../utils/errors");
const {ServerError} = require("../../../utils/errors");
const sgMail = require('@sendgrid/mail');

/**
 * @route   POST api/healthprofessional/auth/login
 * @desc    logging in user
 * @access  Public
 */

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await HealthProfessionalUser.findOne({ email }).select("+password");
    if (!user) throw new BadRequest('User does not exist');

    let isMatch;
    let isTemporary = false;

    if(user.isTemporaryExpiryValid()){
        isMatch = user.compareTemporaryPassword(password);
        isTemporary = true;
    } else {
        isMatch = user.comparePassword(password);
    }

    if (!isMatch) throw new BadRequest('Invalid credentials');

    const token = jwt.sign({ id: user._id, type: userType.HEALTH }, JWT_SECRET, { expiresIn: 3600 });
    if (!token) throw new BadRequest('Couldn\'t sign the token');

    res.status(200).json({
        success: true,
        token,
        userId: user._id,
        type: userType.HEALTH,
        isTemporary
    });
}));

/**
 * @route   POST api/healthprofessional/auth/register
 * @desc    Register new user
 * @access  Public
 */

router.post('/register', asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, phone, healthID } = req.body;

    // Simple validation
    if (!firstName || !lastName || !email || !password || !healthID) {
        throw new BadRequest('Please enter all fields');
    }

    const user = await HealthProfessionalUser.findOne({ email });
    if (user) throw new BadRequest('User already exists');

    const newUser = new HealthProfessionalUser({
        firstName,
        lastName,
        email,
        password,
        phone,
        healthID
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw new ServerError('Something went wrong saving the user');

    const token = jwt.sign({ id: savedUser._id, type: userType.HEALTH }, JWT_SECRET, {
        expiresIn: 3600
    });

    res.status(200).json({
        success: true,
        token,
        userId: savedUser._id,
        type: userType.HEALTH
    });
}));

/*
* @route   POST api/healthprofessional/auth/changepassword
* @desc    Change password
* @access  Private
*/

router.post('/changepassword', authMiddleware(userType.HEALTH), asyncHandler(async (req, res) => {
    const { userId, currentPassword, newPassword, confirmPassword } = req.body;

    // Simple validation
    if (!userId || !currentPassword || !newPassword || !confirmPassword) {
        throw new BadRequest('Please enter all fields');
    }

    if (newPassword !== confirmPassword) {
        throw new BadRequest('Password and confirm password do not match');
    }

    // check id is valid
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new BadRequest('UserId is invalid');

    // Check for existing user
    const user = await HealthProfessionalUser.findById(userId).select("+password");
    if (!user) throw new BadRequest('User does not exist');

    const isMatchCurrent = user.comparePassword(currentPassword);
    if (!isMatchCurrent) throw new BadRequest('Current password doesn\'t match');

    user.password = newPassword;

    const savedUser = await user.save();

    if (!savedUser) throw new ServerError('Something went wrong saving the user');
    res.status(200).json({
        success: true,
        userId: savedUser.id,
    });
}));

/*
* @route   POST api/healthprofessional/auth/forgotpassword
* @desc    Forgot password
* @access  Public
*/

router.post('/forgotpassword', asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Simple validation
    if (!userId) {
        throw new BadRequest('Please enter all fields');
    }

    // check id is valid
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new BadRequest('UserId is invalid');

    // Check for existing user
    const user = await HealthProfessionalUser.findById(userId);
    if (!user) throw new BadRequest('User does not exist');

    user.setTemporaryPassword();

    const savedUser = await user.save();

    if (!savedUser) throw new ServerError('Something went wrong saving the user');

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        to: 'mr664@uowmail.edu.au', // Change to your recipient
        from: 'mr664@uowmail.edu.au', // Change to your verified sender
        subject: 'Reset Password',
        html: `<strong>The following is your temporay password to login. It expires in 24 hours.<br>You will be directed to chnage your password after you login: ${savedUser.passwordReset.temporaryPassword}</strong>`,
    }

    const msgSent = await sgMail.send(msg)

    if(!msgSent || msgSent[0].statusCode !== 202){
        throw new ServerError("Error sending email");
    }

    res.status(200).json({
        success: true,
        userId: savedUser.id,
    });
}));

/**
 * @route   GET api/healthprofessional/auth/user
 * @desc    Check user valid
 * @access  Private
 */

router.get('/user', authMiddleware(userType.HEALTH), asyncHandler(async (req, res) => {
    // check id is valid
    if(!mongoose.Types.ObjectId.isValid(req.userId)) throw new BadRequest('UserId is invalid');

    const user = await HealthProfessionalUser.findById(req.userId);
    if (!user) throw new Unauthorized('User does not exist');
    res.json({id: user.id, type: userType.HEALTH});
}));

module.exports = router;