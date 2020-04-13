const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');


// @desc    Get all users
// @route   Get /api/v1/users
// @access  Private
exports.getUsers = asyncHandler(async (req, res, next) => {

    const users = await User.find();
    res
        .status(200)
        .json(users);

});

// @desc    Get user by id
// @route   Get /api/v1/users/:id
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user) {
        return next(
            new ErrorResponse(`User not found with id of ${req.params.id}`,
                404));
    }

    res
        .status(200)
        .json({ success: true, data: user })

});

// @desc    Create a user
// @route   POST /api/v1/users
// @access  Private
exports.createUser = asyncHandler(async (req, res, next) => {

    const user = await User.create(req.body);
    res
        .status(201)
        .json({
            success: true,
            data: user })

});

// @desc    Update a user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!user) {
        return next(
            new ErrorResponse(`User not found with id of ${req.params.id}`,
                404));
    }

    res.status(200).json({
        success: true,
        data: user
    })

});

// @desc    Delete a users
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndDelete(req.params.id);

    if(!user) {
        return next(
            new ErrorResponse(`User not found with id of ${req.params.id}`,
                404));
    }

    res
        .status(200)
        .json({
            success: true,
            deleted: true,
            data: user
        });

});

