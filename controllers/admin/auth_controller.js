const { ErrorHandler } = require("../../helper");
const { NOT_FOUND, CONFLICT, INVALID } = require("../../helper/status-codes");
const { createToken } = require("../../middleware/auth");
const { Admin } = require("../../models");
const { asyncCall, validateEmail } = require("../../utils/helper");
const adminService = require("../../services/admin");

const login = async (req, res, next) => asyncCall(async () => {
    let { email, password } = req.body;
    if (!email || !validateEmail(email)) throw new ErrorHandler(INVALID, 'Please provide a valid email');
    let admin = await Admin.findOne({ email });
    if (!admin) throw new ErrorHandler(NOT_FOUND, 'Admin account not found with this email address.');
    if (!password) throw new ErrorHandler(INVALID, 'Please provide a password');
    let isValidPassword = await admin.isValidPassword(password.toString());
    if (!isValidPassword) throw new ErrorHandler(INVALID, 'You have entered an wrong password');
    let token = createToken({ email: email, date: new Date() });
    req.isLogin = true;
    let data = await adminService.updateAdmin(req, res, next);
    var newdata = {}
    newdata.token = token;
    newdata.admin = data;
    return newdata;
}, next);

/// register
const register = async (req, res, next) => asyncCall(async () => {
    let { email } = req.body;
    let admin = await Admin.findOne({ email });
    if (admin) throw new ErrorHandler(CONFLICT, 'An admin with this email already exists');
    let token = createToken({ email: email, date: new Date() });
    req.authToken = token;
    let data = await adminService.addAdmin(req, res, next);
    var newdata = {};
    newdata.token = token;
    newdata.admin = data;
    return newdata;
}, next);


/// update admin
const update = async (req, res, next) => {
    const { name, email, isSuperAdmin, permissions, deviceInfo, password } = req.body;
    let admin = await Admin.findOne({ email });
    if (!admin) throw new ErrorHandler(NOT_FOUND, 'Admin not found', admin);
}

///getAllAdmins
const getAllAdmins = async (req, res, next) => asyncCall(async () => {
    let data = await adminService.getAdmins(req, res, next);
    return data;
}, next);

module.exports = { login, register, update, getAllAdmins };

