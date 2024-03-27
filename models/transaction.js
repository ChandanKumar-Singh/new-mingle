const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    type: {
        type: String,
        required: [true, 'Type is required'],
        trim: true,
        validate: {
            validator: (value) => {
                return value.length <= 50; // For example, validate maximum length
            },
            message: 'Type must be less than or equal to 50 characters'
        }
    },
    from: { type: String, trim: true },
    to: { type: String, trim: true },
    status: { type: String, required: [true, 'Status is required'], trim: true },
    accountNumber: { type: Number },
    bankName: { type: String, trim: true },
    accountName: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        default: 0.0,
        validate: {
            validator: (value) => {
                // Add custom validation logic if needed
                return value >= 0; // For example, validate positive value
            },
            message: 'Amount must be a positive number'
        }
    },
    paypalEmail: { type: String, trim: true },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
