const { Sound } = require("../models");

const addSound = async (data) => {
    console.log('Sound', data);
    return await (await new Sound(data).save({ new: true })).populate('addedBy', 'name email profilePicture smallProfilePicture');
}

const getSound = async (query) => {
    let sounds = await Sound.find(query).populate('addedBy', 'name email profilePicture smallProfilePicture').sort({ createdAt: -1 });
    return sounds;
}

const deleteSound = (id) => {
    return Sound.findByIdAndUpdate(id, { isDeleted: true })
}

const updateSound = async (id, data) => {
    return await Sound.findByIdAndUpdate(id, data, { new: true }).populate('addedBy', 'name email profilePicture smallProfilePicture')
}

module.exports = {
    addSound,
    getSound,
    deleteSound,
    updateSound
};