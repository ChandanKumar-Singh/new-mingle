const multer = require('multer');
const path = require('path');
const { ErrorHandler } = require('../helper');
const { BAD_GATEWAY } = require('../helper/status-codes');
const fs = require('fs');
const { asyncCall } = require('./helper');
const mime = require('mime-types');

/** 
 * check mime type
 * @param {array} mimeTypes
 * @returns {function} mimeTypesFilter
 */
const checkMime = function (mimeTypes) {
    return function mimeTypesFilter(req, file, cb) {
        const ext = path.extname(file.originalname);
        if (mimeTypes.includes(file.mimetype) || videoExt.includes(ext)) {
            cb(null, true);
        } else {
            // throw new ErrorHandler(BAD_GATEWAY, `Only ${mimeTypes.map((e) => e.toString().split('/')[1]).join(', ')} files are allowed.`);
            cb(null, false);
        }
    };
}

const imageMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/octet-stream'];
const videoMimes = ['video/mp4', 'video/mkv', 'video/avi', 'application/octet-stream'];
const docMimes = ['application/msword', 'application/pdf'];
const audioMimes = ['audio/mp3', 'audio/wav', 'audio/aac', 'audio/mpeg'];

const videoExt = ['.mp4', '.mkv', '.avi'];
const imageExt = ['.jpg', '.jpeg', '.png'];
const soundExt = ['.mp3', '.wav', '.aac'];

const mimesArray = {
    sound: audioMimes,
    image: imageMimes,
    video: videoMimes,
    document: docMimes,
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const assetFolder = 'public';
        const isImage = imageMimes.includes(file.mimetype);
        const isVideo = videoMimes.includes(file.mimetype);
        const isDocument = docMimes.includes(file.mimetype);
        const isSound = audioMimes.includes(file.mimetype);
        const ext = path.extname(file.originalname);

        // const isImage = imageExt.includes(ext);
        // const isVideo = videoExt.includes(ext);


        console.log('Storage file', file, isImage, isDocument);
        let dir;
        if (isVideo) {
            dir = `${assetFolder}/videos/${file.fieldname}`;
        } else if (isImage) {
            dir = `${assetFolder}/images/${file.fieldname}`;
        }
        else if (isSound) {
            dir = `${assetFolder}/sounds`;
        }
        else if (isDocument) {
            dir = `${assetFolder}/documents`;
        }
        else {
            dir = `${assetFolder}/others`;
        }
        // dir = path.join(__dirname, dir);
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const name = Date.now() + path.extname(file.originalname);
        cb(null, name);
    }
});
// const fileFilter = (req, file, cb) => {
//     if (file.fieldname === "image") {
//         (file.mimetype === 'image/jpeg'
//             || file.mimetype === 'image/png')
//             ? cb(null, true)
//             : cb(null, false);
//     }
//     else if (file.fieldname === "document") {
//         (file.mimetype === 'application/msword'
//             || file.mimetype === 'application/pdf')
//             ? cb(null, true)
//             : cb(null, false);
//     }
//     else {
//         console.log('File filter error', file.mimetype, file.fieldname);
//         cb(null, true);
//     }
// }

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter
// }).fields([{ name: 'document', maxCount: 1 }, { name: 'image', maxCount: 2 }]);

// const uploadFile = (req, res, next) => asyncCall(async () => {
//     upload(req, res, (err) => {
//         console.log('Upload file ', req.files,);
//         if (err) {
//             return next(err);
//         }
//         next();
//     });
// }, next);

const userFirstProfileUpload = (req, res, next, fields, filters) => {
    console.log('User first profile upload', fields, filters);
    const upload = multer({
        storage: storage,
        fileFilter: checkMime(filters ?? [
            ...imageMimes, ...docMimes, ...videoMimes, ...audioMimes])
    }).fields(fields);
    upload(req, res, (err) => {
        console.log('Upload file ', req.files,);
        if (err) return next(err);
        next();
    });
}


const fieldnames = {
    profilePic: 'profile_pic',
    mediaFiles: 'media_files',
    feeds: 'feeds',
    storyMedia: 'story',
    sound: 'sound',

}

/// delete file or files 
const deleteFiles = (filePath) => {
    console.log('Delete files', filePath);
    try {
        if (Array.isArray(filePath)) {
            filePath.forEach(file => {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            });
        }
        else {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    } catch (err) {
        console.log('Error in deleteFiles', err);
    }
}

function deleteFilesFromRequest(req) {
    if (req.file || req.files) {
        let filePaths = [];
        if (req.files && typeof req.files === 'object') {
            const filesArray = Object.values(req.files).flat();
            filePaths = filesArray.map(file => file.path);
        } else if (req.file) {
            filePaths.push(req.file.path);
        }
        deleteFiles(filePaths);
    }
}


module.exports = {
    fieldnames,
    deleteFiles,
    deleteFilesFromRequest,
    upload : userFirstProfileUpload,
    mimesArray
};

