const { asyncCall } = require("../utils/helper");

const newUserFirstProfile = async (req, res, next) => asyncCall(async () => {
    const { profile_pic, media_files } = req.body;
    console.log('profile_pic', req.files, req.file, req.body);
    next();
}, next);

module.exports = {
    newUserFirstProfile
}