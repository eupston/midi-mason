const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.isAuth = asyncHandler(async (req, res, next) => {
    let token;
    const bearer = req.headers.authorization;
    if (bearer ) {
        token = req.headers.authorization.split(" ")[1];
    }
    // Make sure token is sent
    if (!token) {
        return next(new ErrorResponse("No authorized token provided to access this route", 401));
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        console.log(err)
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
});
