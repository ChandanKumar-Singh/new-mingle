// models.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required for creating wallet'] },
    balance: { type: Number, required: [true, 'Balance is required'], default: 0.0 },
    points: { type: Number, required: [true, 'Points are required'], default: 0 },
    depositsTotal: { type: Number, required: [true, 'Deposits total is required'], default: 0.0 },
    withdrawalsTotal: { type: Number, required: [true, 'Withdrawals total is required'], default: 0.0 },
    deposits: { type: [Object], required: [true, 'Deposits are required'], default: [] },
    withdrawals: { type: [Object], required: [true, 'Withdrawals are required'], default: [] },
    rewards: { type: [Object], required: [true, 'Rewards are required'], default: [] },
    rewardsTotal: { type: Number, required: [true, 'Rewards total is required'], default: 0.0 },
    earnings: { type: [Object], required: [true, 'Earnings are required'], default: [] },
    earningsTotal: { type: Number, required: [true, 'Earnings total is required'], default: 0.0 },
    gifts: { type: [Object], required: [true, 'Gifts are required'], default: [] },
    transactions: {
        type: [Schema.Types.ObjectId],
        ref: 'Transaction',
        required: [true, 'Transactions are required'],
        default: [],
    }, // Embedding TransactionModel schema
    giftsTotal: { type: Number, required: [true, 'Gifts total is required'], default: 0.0 },
});

// Create models based on schemas
const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
