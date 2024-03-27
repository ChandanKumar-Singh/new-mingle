const notification = require("./notification");
const { ErrorHandler } = require("../helper");
const { NOT_FOUND } = require("../helper/status-codes");
const FeedModel = require("../models/feed");
const { addRemoveInList } = require("../utils/helper");
const { notificationTopics, getTitle, getBody } = require("./notification");
const { FeedComment, User } = require("../models");

const createFeed = async (userId, title, caption, contents) => {
    const feed = new FeedModel({
        userId,
        title,
        caption,
        contents,
    });
    return await (await feed.save({ new: true })).populate('userId');
}


const getMyFeeds = async (userId, query) => {
    const total = await FeedModel.countDocuments({ userId });
    const feeds = (await FeedModel.find({ userId }).populate('likes', 'fullName smallProfilePicture profilePicture').populate('comments').populate('userId', 'fullname _id profilePicture smallProfilePicture').skip(query.skip).limit(query.limit).sort(query.sort));
    return {
        total,
        feeds
    };
}

const getFilterdFeeds = async (userId, query, excluedMe) => {
    const findQuery = excluedMe ? { userId: { $ne: userId } } : {};
    const total = await FeedModel.countDocuments(findQuery);
    const feeds = (await FeedModel.find(findQuery).populate('likes', 'fullName smallProfilePicture profilePicture').populate('comments').populate('userId', 'fullname _id profilePicture smallProfilePicture').skip(query.skip).limit(query.limit).sort(query.sort));
    return {
        total,
        feeds
    };
}

const likeFeed = async (userId, name, feedId) => {
    let feed = await FeedModel.findById(feedId).populate('userId')
    // .populate('userId');
    if (!feed) throw new ErrorHandler(NOT_FOUND, 'Feed not found');
    feed.likes = addRemoveInList(feed.likes, userId);
    let isLiked = feed.likes.includes(userId);
    feed = await (await (await feed.save({ new: true })).populate('likes', 'fullName smallProfilePicture profilePicture')).populate('comments');
    // // feed = await FeedModel.findById(feed._id).populate('likes', 'fullName smallProfilePicture profilePicture');
    // // let likes = [];
    // // if (feed.likes.length > 0) feed.likes = await User.find({ _id: { $in: feed.likes } }, 'fullName profilePic');
    // if (isLiked) {
    //     notification.sendNotification(feed.userId.notificationTokens, 'New like', `${name} liked your feed`, { feedId });
    // }
    return { isLiked, feed };
}

const comment = async (userId, feedId, comment) => {
    let feed = await FeedModel.findById(feedId).populate('userId');
    if (!feed) throw new ErrorHandler(NOT_FOUND, 'Feed not found');
    const _comment = new FeedComment({ feedId, userId, comment });
    await _comment.save({ new: true });
    console.log('_comment', feed.comments, _comment._id);
    feed.comments = [...feed.comments, _comment._id];
    return await (await (await feed.save({ new: true })).populate('likes', 'fullName smallProfilePicture profilePicture')).populate('comments');
}

module.exports = {
    createFeed,
    getMyFeeds,
    getFilterdFeeds,
    likeFeed,
    comment,
};