const { ErrorHandler } = require("../../helper");
const { NOT_FOUND, CONFLICT, INVALID } = require("../../helper/status-codes");
const { Admin, User } = require("../../models");
const { asyncCall, validateEmail } = require("../../utils/helper");
const userService = require("../../services/user");

const getAllUsers = async (req, res, next) => asyncCall(async () => {
    let data = await userService.getAllUsers(req, res, next);
    return data;
}, next);

/// ban single user
const banUser = async (req, res, next) => asyncCall(async () => {
    const { id, reason, status } = req.body;
    if (!id) throw new ErrorHandler(INVALID, 'User id is required');
    if (status === null) throw new ErrorHandler(INVALID, 'Status is required');
    await userService.getUserById(id);
    let user = await userService.banUser(id, reason, status);
    return { user };
}, next);





module.exports = { getAllUsers, banUser };
