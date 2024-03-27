const mongoose = require('mongoose');

const soundSchema = new mongoose.Schema({
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    categoryId: { type: Number, required: [true, 'Sound category ID is required'] },
    title: { type: String, default: '' },
    sound: { type: String, required: [true, 'Sound is required'] },
    duration: { type: Number },
    singer: { type: String, default: '' },
    image: { type: String, default: '' },
    hashTag: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    size: { type: Number },
}, { timestamps: true });

const Sound = mongoose.model('Sound', soundSchema);

module.exports = Sound;
