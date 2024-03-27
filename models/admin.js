
const mongoose = require('mongoose');
const { admin } = require('../services');
const { Schema } = mongoose;
const { hashPassword, comparePassword } = require('../utils/hash');

const adminSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']

    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email format'
        }
    },
    
    password: { 
        type: String,
        required: true
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    permissions: {
        type: [String],
        enum: ['Verfication', 'Report', 'Account Delete'],
        default: []
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    deviceInfo: {
        type: [
            {
                deviceId: {
                    type: String,
                    required: true
                },
                deviceName: {
                    type: String,
                    required: true
                },
                deviceType: {
                    type: String,
                    enum: ['iOS', 'Android', 'Web', 'Others', 'Windows', 'Mac'],
                    required: true
                },
                lastLogin: {
                    type: Date,
                    default: Date.now
                },
                fcmToken: {
                    type: String,
                    required: true
                },
            },],
        default: [],
        /// max length of deviceInfo is 3
        validate: [v => v.length <= 3, 'Only 3 devices are allowed per admin']

    },
}, { timestamps: true });

adminSchema.methods.hasPermission = function (permission) {
    return this.permissions.includes(permission);
}

adminSchema.methods.isValidPassword = async function (password) {
    return await comparePassword(this.password, password);
}

// hash password before saving to database
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await hashPassword(this.password);
    next();
});
module.exports = mongoose.model('Admin', adminSchema);

