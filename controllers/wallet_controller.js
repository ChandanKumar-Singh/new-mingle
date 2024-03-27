const { ErrorHandler } = require("../helper");
const { OK, NOT_FOUND } = require("../helper/status-codes");
const { User, Wallet } = require("../models");
const { sendNotification } = require("../services/notification");
const walletService = require("../services/wallet");
const { asyncCall } = require("../utils/helper");

const createWallet = async (req, res, next) => asyncCall(async () => {
    const { userId } = req.body;
    if (!userId) throw new ErrorHandler(NOT_FOUND, "User id is required to create wallet");
    const user = await User.findById(userId);
    if (!user) throw new ErrorHandler(NOT_FOUND, "User account not found");
    let wallet = await Wallet.findOne({ user: user._id });
    if (wallet) throw new ErrorHandler(NOT_FOUND, "Wallet already exists", { wallet: wallet });
    wallet = await walletService.createWallet(user._id);
    /// send email to user that wallet has been created
    sendNotification(user.notificationTokens, "Wallet created", "Your wallet has been created successfully", { walletId: wallet._id.toString() });
    return { message: "Wallet created successfully👌", wallet };
}, next);

const addWalletBalance = async (req, res, next) => asyncCall(async () => {
    const { userId } = req.body;
    if (!userId) throw new ErrorHandler(NOT_FOUND, "User id is required to update wallet balance");
    const user = await User.findById(userId);
    if (!user) throw new ErrorHandler(NOT_FOUND, "User not found");
    let wallet = await walletService.updateWallet(req.body, user._id);
    sendNotification(user.notificationTokens, "Wallet balance updated", "Your wallet balance has been updated successfully", { walletId: wallet._id.toString() });
    return { message: "Wallet balance updated successfully💰", wallet };
}, next);

const getWalleyByUserId = async (req, res, next) => asyncCall(async () => {
    const { userId } = req.params;
    if (!userId) throw new ErrorHandler(NOT_FOUND, "User id is required to get wallet");
    const user = await User.findById(userId);
    if (!user) throw new ErrorHandler(NOT_FOUND, "User not found");
    let wallet = await walletService.getWallet(user._id);
    return { wallet };
}, next);






module.exports = {
    createWallet,
    addWalletBalance,
    getWalleyByUserId
}