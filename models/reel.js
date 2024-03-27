const mongoose = require('mongoose');

const reelsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User id is required'] },
  caption: { type: String },
  postVideo: { type: String, required: [true, 'Post video URL is required'], trim: true },
  postType: { type: String, required: [true, 'Post type is required'], trim: true },
  thumbnail: { type: String, required: [true, 'Thumbnail URL is required'], trim: true },
  duration: { type: String },
  postHashTag: { type: String },
  profileCategoryName: { type: String, required: [true, 'Profile category name is required'], trim: true },
  likes: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User id is required'] },
        timestamp: { type: Date, default: Date.now },
      }
    ], default: [],
  },
  saves: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User id is required'] },
        timestamp: { type: Date, default: Date.now },
      }
    ], default: []
  },
  views: {
    type: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User id is required'] },
      timestamp: { type: Date, default: Date.now },
    }], default: []
  },
  comments: { type: [Object], default: [] },
  soundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sound' },
  isTrending: { type: Boolean, default: true },
  videoShowLikes: { type: Boolean, default: true },
  canComment: { type: Boolean, default: true },
  canDuet: { type: Boolean, default: true },
  canSave: { type: Boolean, default: true },
  canDownload: { type: Boolean, default: true },
});

// Compile the model from the schema
const Reels = mongoose.model('Reel', reelsSchema);

module.exports = Reels;
