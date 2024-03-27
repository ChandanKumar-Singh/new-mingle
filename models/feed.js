const mongoose = require('mongoose');


const feedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User id is required'] },
  title: { type: String, default: '' },
  caption: { type: String, default: '' },
  contents: {
    type: [String], default: []
  },
  likes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is required'],
      }
      ,
      { timestamps: true }
    ],
    // type: [String],
    default: []
  },
  likesCount: { type: Number, default: 0 },
  // comments : array of feed comments
  comments: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeedComment',
      }
    ],
    default: []
  },
  commentsCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true },);

/// pre save, manage the likes count if likes are added or removed
feedSchema.pre('save', function (next) {
  if (this.isModified('likes')) {
    this.likesCount = this.likes.length;
  }
  if (this.isModified('comments')) {
    this.commentsCount = this.comments.length;
  }
  next();
});
/// Compile the model from the schema
const FeedModel = mongoose.model('Feed', feedSchema);





module.exports = FeedModel;
