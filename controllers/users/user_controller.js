const User = require("../../models/user");
const { asyncCall, urlCorrector } = require("../../utils/helper");
const userService = require("../../services/user");
const feedService = require("../../services/feeds");
const storyService = require("../../services/story");
const notification = require("../../services/notification");
const { ErrorHandler } = require("../../helper");
const { NOT_FOUND, BAD_GATEWAY } = require("../../helper/status-codes");
const { fileUpload, constant } = require("../../utils");
const { userFollowersTopic, getTitle, notificationTopics, getBody } = require("../../services/notification");




const getUser = async (req, res, next) => asyncCall(async () => {
    return await userService.getAllUsers(req, res, next);
}, next);

// Get user by id
const getUserByToken = async (req, res, next) => asyncCall(async () => {
    let user = await userService.getUserByToken(req, res, next);
    return { user };
}, next);

/// newUserFirstProfile 
const newUserFirstProfile = async (req, res, next) => asyncCall(async () => {
    const files = req.files;
    let allFilesUploaded = false;
    { /// check if files are uploaded
        if (!files) throw new ErrorHandler(BAD_GATEWAY, 'Please upload profile picture and media files');
        /// check if profile picture is uploaded
        if (!files.profile_pic) throw new ErrorHandler(BAD_GATEWAY, 'Please upload profile picture');
        /// check if media files are uploaded
        if (!files.media_files) throw new ErrorHandler(BAD_GATEWAY, 'Please upload media files');
        /// check if media files are less than 3
        if (files.media_files.length < 3) throw new ErrorHandler(BAD_GATEWAY, 'Please upload at least 3 media files');
        allFilesUploaded = true;
    }
    if (!allFilesUploaded) fileUpload.deleteFilesFromRequest(req);
    let user = await userService.newUserFirstProfile(req, res, next);
    return { user };
}, next);

/// update user
const updateUser = async (req, res, next) => asyncCall(async () => {
    // let user = await userService.updateUserProfileById(req, res, next);
    return {};
}, next);

// updateLastSeen
const updateLastSeen = async (req, res, next) => asyncCall(async () => {
    let data = await userService.updateLastSeen(req, res, next);
    return {
        user: data
    };
}, next);

// get blocked users list  of a particular user
const getBlockedUsers = async (req, res, next) => asyncCall(async () => {
    let data = await userService.getBlockedUsers(req, res, next);
    return data;
}, next);

/// block a user by id
const blockUser = async (req, res, next) => asyncCall(async () => {
    const { blockId } = req.body;
    if (!blockId) throw new Error('Please provide user id to block user.');
    let data = await userService.blockUser(req.user.id, blockId);
    return {
        user: data
    };
}, next);

/// get users
const getFilteredUsers = async (req, res, next) => asyncCall(async () => {
    let users = await userService.getFilteredUsers(req, res, next);
    return users;
}, next);


/*
 *user interaction
*/
//  createInteraction
const createInteraction = async (req, res, next) => asyncCall(async () => {
    let data = await userService.createInteraction(req, res, next);
    return data;
}, next);

// deleterInteraction 
const deleterInteraction = async (req, res, next) => asyncCall(async () => {
    let data = await userService.deleterInteraction(req, res, next);
    return data;
}, next);

// getInteractions
const getInteractions = async (req, res, next) => asyncCall(async () => {
    let data = await userService.getInteractions(req, res, next);
    return data;
}, next);

/// updateUser
const updateUserProfileById = async (req, res, next) => asyncCall(async () => {
    const { id } = req.user;
    const user = await User.findOne({ _id: id });
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found');
    let data = await userService.updateUserProfileById(req, res, next, id);
    return data;
}, next);



/// feed
/// create feed
const createFeed = async (req, res, next) => asyncCall(async () => {
    const user = await User.findById(req.user.id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found');
    const { title, caption } = req.body;
    console.log('createFeed', req.body, req.files);
    let contents = [];
    const files = req.files.feeds;
    if (files) contents = req.files.feeds.map(file => file.path);
    let data = await feedService.createFeed(user._id, title, caption, contents);


    /// TODO: send notification to all the followers of the user
    let payload = {
        feedId: data._id.toString(),
        image: files ? constant.imageBaseUrl + contents[0] : '',
    };
    /// send notification to all personal devices
    notification.sendNotification(user.notificationTokens, 'New feed created', 'Feed created successfully 🎉', payload);

    /// send notification to all followers
    notification.sendNotificationToTopic(userFollowersTopic(user._id.toString()), getTitle(notificationTopics.NEW_FEED, user.fullName), getBody(notificationTopics.NEW_FEED, user.fullName), payload);
    return { feed: data };
}, next);


/// get my feeds
const getMyFeeds = async (req, res, next) => asyncCall(async () => {
    const user = await User.findById(req.user.id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User account not found');
    let { limit, page } = req.query;
    const query = {};
    page = page ? page : 1;
    query.limit = limit ? parseInt(limit) : 20;
    query.skip = parseInt(query.limit) * (parseInt(page) - 1);
    query.sort = { createdAt: -1 }
    let data = await feedService.getMyFeeds(user._id, query);
    let newData = {
        total: data.total,
        page: page,
        limit: query.limit,
        feeds: data.feeds,
    };
    return newData;
}, next);



const getFilteredFeeds = async (req, res, next) => asyncCall(async () => {
    const user = await User.findById(req.user.id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User account not found');
    let { limit, page, excluedMe } = req.query;
    const query = {};
    excluedMe = excluedMe ?? false;
    page = page ? page : 1;
    query.limit = limit ? parseInt(limit) : 10;
    query.skip = parseInt(query.limit) * (parseInt(page) - 1);
    query.sort = { createdAt: -1 }
    let data = await feedService.getFilterdFeeds(user._id, query, excluedMe);
    let newData = {
        total: data.total,
        page: page,
        limit: query.limit,
        feeds: data.feeds,
    };
    return newData;

}, next);

const likeFeed = async (req, res, next) => asyncCall(async () => {
    const user = await User.findById(req.user.id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User account not found');
    // feed id from req.params
    const { id } = req.params;
    let data = await feedService.likeFeed(user._id, user.fullName, id);
    /// TODO: send notification to the user who created the feed if liked
    let payload = {
        feedId: id,
        image: constant.imageBaseUrl + user.profilePic,
    };
    /// send notification to all followers 
    const { isLiked } = data;
    if (isLiked && data.feed.userId) notification.sendNotification(data.feed.userId.notificationTokens, 'New like', `${user.fullName} liked your feed`, payload);
    /// send notification to all followers
    notification.sendNotificationToTopic(userFollowersTopic(user._id.toString()), getTitle(notificationTopics.NEW_LIKE, user.fullName), getBody(notificationTopics.LIKE_FEED, user.fullName), payload);
    return {
        isLiked: isLiked,
        feed: data.feed,
        message:
            isLiked ? 'Feed liked successfully 👍' :
                'Feed disliked successfully 👎'
    };
}, next);

const createFeedComment = async (req, res, next) => asyncCall(async () => {
    const user = await User.findById(req.user.id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User account not found');
    const { id } = req.params;
    const { comment } = req.body;
    if (!comment) throw new ErrorHandler(BAD_GATEWAY, 'Please provide comment');
    let data = await feedService.comment(user._id, id, comment);
    /// TODO: send notification to the user who created the feed if commented
    let payload = {
        feedId: id,
        image: urlCorrector(constant.imageBaseUrl + user.profilePicture,)
    };
    console.log('comment', payload, data.userId.notificationTokens);
    /// send notification to owner devices
    notification.sendNotification(user.notificationTokens, 'New comment', 'Comment added successfully 📝', payload);

    return {
        message: 'Comment added successfully 📝',
        feed: data
    }
}, next);

/// story
const addStory = async (req, res, next) => asyncCall(async () => {
    const { id } = req.user;
    let user = await User.findById(id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found');
    let files = req.files;
    if (!files) throw new ErrorHandler(NOT_FOUND, 'Please provide story media');
    console.log('addStory', req.body, files);
    if (files.story && files.story.length > 0) {
        req.media = files.story[0].path;
    }

    const { story, postType } = req.body;
    if (!postType) throw new ErrorHandler(NOT_FOUND, 'Please provide post type');
    let data = await storyService.addStory(req, res);
    /// send notification to all the followers of the user
    let payload = {
        storyId: data._id.toString(),
        image: req.media ? constant.imageBaseUrl + req.media : '',
    };
    notification.sendNotificationToTopic(userFollowersTopic(user._id.toString()), getTitle(notificationTopics.NEW_STORY, user.fullName), getBody(notificationTopics.NEW_STORY, user.fullName), payload);
    /// send notification to all personal devices
    notification.sendNotification(user.notificationTokens, 'New story added', 'Story added successfully 🎉', payload);
    return {
        data
    }
}, next);

const getFilteredStories = async (req, res, next) => asyncCall(async () => {
    const user = await User.findById(req.user.id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User account not found');
    let { limit, page } = req.query;
    const query = {};
    page = page ? page : 1;
    query.limit = limit ? parseInt(limit) : 30;
    query.skip = parseInt(query.limit) * (parseInt(page) - 1);
    let iQuery = {};
    /// not in blocked users list and my stories
    iQuery.userId = { $nin: [...user.blockeduserslist, user._id] };
    iQuery.createdAt = { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) };
    query.sort = { createdAt: -1 }
    let data = await storyService.getFilterdStories(user._id, query, iQuery);
    let newData = {
        query: { ...query, ...iQuery },
        total: data.total,
        page: page,
        limit: query.limit,
        stories: data.stories,
    };
    return newData;
}, next);

const getMyLatestStory = async (req, res, next) => asyncCall(async () => {
    const user = await User.findById(req.user.id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User account not found');
    let query = {};
    query.userId = user._id;
    query.createdAt = { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) };
    let data = await storyService.getFilterdStories(user._id, { skip: 0, limit: 100 }, query);
    return {
        query,
        total: data.total,
        stories: data.stories,

    };
}, next);

const likeStory = async (req, res, next) => asyncCall(async () => {
    const user = await User.findById(req.user.id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User account not found');
    const { id } = req.params;
    let data = await storyService.likeStory(user._id, id);
    data.message = data.isLiked ? 'Story liked successfully 👍' : 'Story disliked successfully 👎';
    return data;

}, next);

module.exports = {
    getUser, getUserByToken, updateUser, newUserFirstProfile, updateUserProfileById, updateLastSeen, getBlockedUsers, blockUser, getFilteredUsers,

    /*
     * user interaction
    */
    createInteraction, deleterInteraction, getInteractions,


    /// feed
    createFeed,
    getMyFeeds,
    getFilteredFeeds,
    likeFeed,
    createFeedComment,

    /// story
    addStory,
    getFilteredStories,
    getMyLatestStory,
    likeStory

};