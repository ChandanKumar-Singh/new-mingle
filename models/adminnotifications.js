

const mongoose = require('mongoose');
const { Schema } = mongoose;


const adminnotificationSchema = new Schema({
    action: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imageurl: {
        type: String,
        required: true
    },
    lastupdated: {
        type: Date,
        default: Date.now
    },
    createdby: {
        type: String,
    },
    status: {
        type: String,
        required: true
    },
    priority: {
        type: number,
        required: true
    },
    role: {
        type: String,
    },



}, {
    timestamps: true
});


module.exports = mongoose.model('AdminNotification', adminnotificationSchema);




