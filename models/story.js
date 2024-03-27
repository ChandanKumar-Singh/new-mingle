const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String },
    url: { type: String, required: true },
    postType: { type: String, enum: ['image', 'video', 'text'], required: [true, ""] },
    sound: { type: mongoose.Schema.Types.ObjectId, ref: 'Sound' },
    thumbnail: { type: String },
    duration: { type: Number },
    postHashTag: { type: String },
    isSeen: { type: Boolean, default: false },
    isLiked: { type: Boolean, default: false },
    seenCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    bgColor: { type: String },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true },);

/// manage count of likes and seen
storySchema.pre('save', async function (next) {
    if (this.isModified('likes')) {
        this.likesCount = this.likes.length;
    }
    if (this.isModified('seenBy')) {
        this.seenCount = this.seenBy.length;
    }
    next();
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
