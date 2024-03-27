const mongoose = require('mongoose');

// Define the schema
const userInteractionSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creater id is required'],
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Opponent id is required']
    },
    isSuperLike: {
        type: Boolean,
        default: false
    },
    isLike: {
        type: Boolean,
        default: false
    },
    isDislike: {
        type: Boolean,
        default: false
    },
    isBlock: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true

});
// pre function to check any of the interaction is true
userInteractionSchema.pre('save', async function (next) {
    if (!this.isModified('isSuperLike') && !this.isModified('isLike') && !this.isModified('isDislike')) {
        return next();
    }
    if (this.isSuperLike === true || this.isLike === true || this.isDislike === true) {
        next();
    } else {
        throw new Error('Please provide any of the interaction');
    }
});

// Compile the schema into a model
const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);

module.exports = UserInteraction;
