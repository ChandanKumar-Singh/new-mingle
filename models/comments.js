const { Schema, default: mongoose } = require("mongoose");

const commentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User id is required'] },
    comment: { type: String, required: [true, 'Comment is required'], trim: true },
    commentType: { type: String, trim: true },
    refId: { type: mongoose.Schema.Types.ObjectId, required: [true, 'Ref id is required'] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;