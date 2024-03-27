const mongoose = require('mongoose');

const feedCommentSchema = new mongoose.Schema({
    feedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feed', required: [true, 'Feed id is required'] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User id is required'] },
    comment: { type: String, required: [true, 'Comment is required'], trim: true },
    commentType: { type: String, trim: true },
    isVerify: { type: Boolean },
}, { timestamps: true });

const FeedComment = mongoose.model('FeedComment', feedCommentSchema);

module.exports = FeedComment;
