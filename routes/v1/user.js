const router = require('express').Router();
const { dispatcher, userReqValidator } = require('../../middleware');
const { role } = require('../../helper');
const { userController } = require('../../controllers');
const service = require('../../services');
const { fileUpload } = require('../../utils');

/// get all settings
router.get('/get', (req, res, next) => dispatcher(req, res, next, userController.user.getUser, []));
router.get('/getUserByToken', (req, res, next) => dispatcher(req, res, next, userController.user.getUserByToken, [role.USER]));

// /// add new setting
router.post('/login', (req, res, next) => dispatcher(req, res, next, userController.auth.login, []));

// /// register
router.post('/register', (req, res, next) => dispatcher(req, res, next, userController.auth.register, []));

/// checkUserExistsWithEmailOrPhone
router.get('/check-account', (req, res, next) => dispatcher(req, res, next, userController.auth.checkUserExistsWithEmailOrPhone, []));

///newUserFirstProfile
router.post('/newUserFirstProfile',
    (req, res, next) => fileUpload.upload(req, res, next, [{ name: fileUpload.fieldnames.profilePic, maxCount: 1 }, { name: fileUpload.fieldnames.mediaFiles, maxCount: 15 }]),
    (req, res, next) => dispatcher(req, res, next, userController.user.newUserFirstProfile, [role.USER]));
/// update user
router.post('/updateUser', (req, res, next) => dispatcher(req, res, next, userController.user.updateUser, [role.USER]));

/// update user by id
router.post('/updateUserProfileById', (req, res, next) => dispatcher(req, res, next, userController.user.updateUserProfileById, [role.USER, role.ADMIN]));

// updateLastSeen
router.post('/updateLastSeen', (req, res, next) => dispatcher(req, res, next, userController.user.updateLastSeen, [role.USER]));

/// get blocked users list  of a particular user
router.get('/getBlockedUsers', (req, res, next) => dispatcher(req, res, next, userController.user.getBlockedUsers, [role.USER]));

/// block a user by id
router.post('/blockUser', (req, res, next) => dispatcher(req, res, next, userController.user.blockUser, [role.USER]));


/// get filterd users
router.post('/getFilteredUsers', (req, res, next) => dispatcher(req, res, next, userController.user.getFilteredUsers, [role.USER]));

/*
    *user interaction
    */

//  createInteraction
router.post('/createInteraction', (req, res, next) => dispatcher(req, res, next, userController.user.createInteraction, [role.USER]));

//  getInteraction
router.get('/deleteInteraction/:id', (req, res, next) => dispatcher(req, res, next, userController.user.deleterInteraction, [role.USER]));

//  getInteraction
router.post('/getInteractions', (req, res, next) => dispatcher(req, res, next, userController.user.getInteractions, [role.USER]));




/// feed
router.post('/feed/create',
    (req, res, next) => fileUpload.upload(req, res, next, [{ name: fileUpload.fieldnames.feeds, maxCount: 5 }]),
    (req, res, next) => dispatcher(req, res, next, userController.user.createFeed, [role.USER]));
router.get('/feed/my-feeds', (req, res, next) => dispatcher(req, res, next, userController.user.getMyFeeds, [role.USER]));
router.get('/feed/getFiltered', (req, res, next) => dispatcher(req, res, next, userController.user.getFilteredFeeds, [role.USER]));
router.get('/feed/like/:id', (req, res, next) => dispatcher(req, res, next, userController.user.likeFeed, [role.USER]));
router.post('/feed/comment/:id',
    (req, res, next) => fileUpload.upload(req, res, next, [{ name: fileUpload.fieldnames.feeds, maxCount: 1 }]),
    (req, res, next) => dispatcher(req, res, next, userController.user.createFeedComment, [role.USER]));


/// story
router.post('/story/add',
    (req, res, next) => fileUpload.upload(req, res, next, [{ name: fileUpload.fieldnames.storyMedia, maxCount: 1 }]),
    (req, res, next) => dispatcher(req, res, next, userController.user.addStory, [role.USER]));
router.get('/story/getList', (req, res, next) => dispatcher(req, res, next, userController.user.getFilteredStories, [role.USER]));
router.get('/story/my-stories', (req, res, next) => dispatcher(req, res, next, userController.user.getMyLatestStory, [role.USER]));
router.get('/story/like/:id', (req, res, next) => dispatcher(req, res, next, userController.user.likeStory, [role.USER]));



/// add sound
router.post('/sound/add',
    (req, res, next) => fileUpload.upload(req, res, next, [{ name: fileUpload.fieldnames.sound, maxCount: 1 }], fileUpload.mimesArray.sound),
    (req, res, next) => dispatcher(req, res, next, userController.sound.addSound, [role.USER]));
router.get('/sound/getList', (req, res, next) => dispatcher(req, res, next, userController.sound.getSound, [role.USER]));
router.get('/sound/delete/:id', (req, res, next) => dispatcher(req, res, next, userController.sound.deleteSound, [role.USER]));
router.post('/sound/update/:id',
    (req, res, next) => fileUpload.upload(req, res, next, []),
    (req, res, next) => dispatcher(req, res, next, userController.sound.updateSound, [role.USER]));


module.exports = router;