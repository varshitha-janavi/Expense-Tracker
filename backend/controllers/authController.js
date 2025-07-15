const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1h'});
};

// Register User
exports.registerUser = async (req, res) => {};

exports.loginUser = async (req, res) => {};

exports.getUserInfo = async (req, res) => {};