const { ErrorHandler } = require("../../helper");
const { CONFLICT, INVALID, NOT_FOUND } = require("../../helper/status-codes");
const { createToken } = require("../../middleware/auth");
const User = require("../../models/user");
const userService = require("../../services/user");
const { asyncCall, validateEmail } = require("../../utils/helper");

/// register
const register = async (req, res, next) => asyncCall(async () => {
    let { email, password, deviceInfo } = req.body;

    let user = await User.findOne({ email });
    if (user) throw new ErrorHandler(CONFLICT, 'An user with this email already exists');
    if (!deviceInfo) throw new ErrorHandler(INVALID, 'Please provide device info');
    req.isAdmin = false;
    let data = await userService.createUser(req, res, next);
    let token = createToken({ id: data._id, email: email, date: new Date() });
    req.authToken = token;
    var newdata = {};
    newdata.token = token;
    newdata.user = data.user;
    newdata.wallet = data.wallet;
    /// send notification to user for account creation and complete profile
    return newdata;
}, next);

// login
const login = async (req, res, next) => asyncCall(async () => {
    let { email, phoneNumber, password, deviceInfo } = req.body;
    if (!email && !phoneNumber) throw new ErrorHandler(INVALID, 'Please provide email or phone number');
    if (email && !validateEmail(email)) throw new ErrorHandler(INVALID, 'Please provide a valid email address');
    let user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (!user) throw new ErrorHandler(NOT_FOUND, `User account not found with this ${email ? 'email address' : 'phone number'}.`);
    if (!password && email) throw new ErrorHandler(INVALID, 'Please provide a password');
    if (email) {
        let isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) throw new ErrorHandler(INVALID, 'You have entered an wrong password');
    }
    if (!deviceInfo) throw new ErrorHandler(INVALID, 'Please provide device info');
    let token = createToken({ id: user._id, date: new Date() });
    req.isLogin = true;
    req.isAdmin = false;
    let data = await userService.loginUser(req, res, next);

    var newdata = {}
    newdata.token = token;
    newdata.user = data;
    return newdata;
}, next);


// checkUserExistsWithEmailOrPhone
const checkUserExistsWithEmailOrPhone = async (req, res, next) => asyncCall(async () => {
    let { email, phoneNumber } = req.query;
    if (!email && !phoneNumber) throw new ErrorHandler(INVALID, 'Please provide email or phone number');
    let user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    return {
        newUser: user ? false : true,
        message: user ? (email ? 'A verification link has been sent to your email address. Please verify your email address to login.' : 'An OTP has been sent to your phone number. Please verify your phone number to login.') : (
            email ? 'A verification link has been sent to your email address. Please verify your email address to register.' :
                'Verify your phone number to register. OTP has been sent to your phone number.'),
        user: user

    };
}, next);




module.exports = { register, login, checkUserExistsWithEmailOrPhone };