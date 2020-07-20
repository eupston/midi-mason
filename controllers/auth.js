const crypto = require("crypto");
const User = require("../models/User");
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");


const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: process.env.SEND_GRID_API_KEY
    }
}));

// @desc    Emails the Site Admin
// @route   POST /api/v1/auth/email
// @access  PUBLIC
exports.postEmail = asyncHandler(async (req, res, next) => {
    const result = await transporter.sendMail({
        to: "eupston130@hotmail.com",
        from: 'site-admin@midi-mason.com',
        subject: req.body.subject,
        html: req.body.content
    });
    return res.status(200)
        .json({
            data: result,
        });
});


// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword )
    if(password !== confirmPassword){
        return next(new ErrorResponse("Password does not match confirmed password", 401));
    }
    // Create user
    const user = await User.create({
        name,
        email,
        password
    });
    sendTokenResponse(user, 200, res);
});


// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorResponse("Invalid Credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid Credentials", 401));
    }
    // Create token
    sendTokenResponse(user, 200, res);
});

// @desc    Log current user out
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});


// @desc    Update user details
// @route   PUT /api/v1/auth/update
// @access  Public
exports.update = asyncHandler(async (req, res, next) => {
    const { name, email } = req.body;

    // update user
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {name, email},
            {
                new: true,
                runValidators: true
            }
        );
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch(err){
            return new ErrorResponse(err, 400);
    }


});


// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Public
exports.updatePassword = asyncHandler(async (req, res, next) => {
    // Create user
    const user = await User.findOne({"email":req.body.email}).select({ "password": 1});
    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse("Password is incorrect", 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }
    res
        .status(statusCode)
        .json({
            success: true,
            token,
            userId: user._id.toString()
        });
};


// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse("There is no user with that email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    console.log(resetToken);
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/auth/resetPassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has 
  requested the reset of a password. Please make a PUT request to: \n\n${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset token",
            message: message
        });

        res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse("Email could not be sent", 500));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Reset Password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resettoken)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse("Invalid token", 400));
    }

    // Set the new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});