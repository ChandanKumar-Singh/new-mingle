const mongoose = require('mongoose');
const { ErrorHandler } = require("../../helper");
const { NOT_FOUND } = require("../../helper/status-codes");
const { User } = require("../../models");
const { asyncCall } = require("../../utils/helper");
const soundServices = require("../../services/sound");
const { default: getAudioDurationInSeconds } = require("get-audio-duration");

const addSound = async (req, res, next) => asyncCall(async () => {
    const { id } = req.user;
    let user = await User.findById(id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'You are not authorized to perform this action');
    let files = req.files;
    if (!files || !files.sound) throw new ErrorHandler(NOT_FOUND, 'Please provide sound file');
    if (files.sound.length > 0) {
        req.body.sound = files.sound[0].path;
        req.body.size = files.sound[0].size;
        await getAudioDurationInSeconds(req.body.sound).then((duration) => {
            console.log(`The duration of the audio is ${duration} seconds`)
            // if(duration>15) throw new ErrorHandler(NOT_FOUND, 'Sound duration should be less than 15 seconds');
            req.body.duration = duration;
            req.body.title = req.body.title || files.sound[0].originalname.split('.')[0].replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

        });
    }
    if (files.image && files.image.length > 0) {
        req.body.image = files.image[0].path;
    }
    req.body.addedBy = id;
    req.body.categoryId = 0;

    let sound = await soundServices.addSound(req.body);
    return {
        sound,
    }
}, next);

const getSound = async (req, res, next) => asyncCall(async () => {
    let query = {};
    let search = req.query.search;
    if (search) {
        const regex = new RegExp(search, 'i');
        query = {
            $or: [
                { title: { $regex: regex } },
                { singer: { $regex: regex } },
                { hashTag: { $regex: regex } },
            ]
        };
    }
    if (req.query.cId) { query.categoryId = req.query.cId; }
    let sounds = await soundServices.getSound(query);
    return {
        total: sounds.length,
        sounds,

    }
}, next);

const deleteSound = async (req, res, next) => asyncCall(async () => {
    let { id } = req.params;
    let sound = await soundServices.deleteSound(id);
    return {
        sound,
    }
}, next);

const updateSound = async (req, res, next) => asyncCall(async () => {
    let { id } = req.params;
    let { title, singer, hasTag, image, categoryId } = req.body;
    let data = {};
    if (title) data.title = title;
    if (singer) data.singer = singer;
    if (hasTag) data.hashTag = hasTag;
    if (image) data.image = image;
    if (categoryId) data.categoryId = categoryId;
    let sound = await soundServices.updateSound(id, data);
    return {
        message: 'Sound updated successfully',
        sound,

    }
}, next);

module.exports = {
    addSound,
    getSound,
    deleteSound,
    updateSound
};
