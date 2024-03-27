const { ErrorHandler } = require("../helper");
const Wallet = require("../models/wallet");
const { BAD_REQUEST, NOT_FOUND } = require("../helper/status-codes");



const createWallet = async (user) => {
    let wallet = new Wallet({ user: user });
    wallet = await (await wallet.save({ new: true })).populate("user", "fullName smallProfilePicture profilePicture email");
    return wallet;
}

const updateWallet = async (body, userId) => {
    const { amount, b_inc, points, p_inc, deposit, d_inc, withdraw, w_inc, transfer, t_inc } = body;
    let wallet = await Wallet.findOne({ user: userId });
    console.log("wallet", wallet);
    if (!wallet) throw new ErrorHandler(NOT_FOUND, "Wallet not found");
    if (amount) {
        if (isNaN(amount)) throw new ErrorHandler(BAD_REQUEST, "Amount must be a number");
        wallet.balance = wallet.balance + (b_inc ? amount : -amount);
    }
    if (points) {
        if (isNaN(points)) throw new ErrorHandler(BAD_REQUEST, "Points must be a number");
        wallet.points = wallet.points + (p_inc ? points : -points);
    }

    await (await wallet.save()).populate("user", "fullName smallProfilePicture profilePicture email");
    return wallet;
}

const getWallet = async (user) => {
    let wallet = await Wallet.findOne
        ({ user: user }).populate("user", "fullName smallProfilePicture profilePicture email");
    wallet = new Wallet({ user: user }).populate("user", "fullName smallProfilePicture profilePicture email");
    return wallet;
}


module.exports = {
    createWallet,
    updateWallet,
    getWallet
}