const notification = require("./notification");
const { fb } = require("../config/fb");
const { ErrorHandler } = require("../helper");
const { CONFLICT, NOT_FOUND } = require("../helper/status-codes");
const User = require("../models/user");
const UserInteraction = require("../models/user-interaction");
const constant = require("../utils/constant");
const { about, aboutMe, appName } = require("../utils/constant");
const { pushList, resizeAndSaveImage } = require("../utils/helper");
const { sendNotification, subscribeToTopic, newUserCreatedTopic, sendNotificationToTopic, getTitle, notificationTopics, getBody, newUserFirstProfileTopic } = require("./notification");
const { Wallet } = require("../models");


//getUsers
const getAllUsers = async (req, res, next) => {
    return await User.find();
}

// get user by id
const getUserById = async (id) => {
    let user = await User.find({ _id: id });
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found', user);
    return user;
}

//getUser
const getUserByToken = async (req, res, next) => {
    let user = await User.findOne({ _id: req.user.id });
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found', user);
    return user;
}

/// create user
const createUser = async (req, res, next) => {
    const { email, deviceInfo, password, loginMode } = req.body;
    deviceInfo.lastLogin = new Date();
    let user = await User.findOne({ where: { email } });
    if (user) throw new ErrorHandler(CONFLICT, 'An user with this email already exists');
    user = new User({ email, deviceInfo, password, loginMode });
    user = await user.save({ new: true });
    let wallet = new Wallet({ user: user._id });
    wallet = await (await wallet.save({ new: true })).populate("user", "fullName smallProfilePicture profilePicture email");
    return { user, wallet };
}


/// loginUser
const loginUser = async (req, res, next) => {
    const { phoneNumber, email, deviceInfo, userAccountSettings } = req.body;
    /// check if user exists with email or phone number
    let user = phoneNumber ? await User.findOne({ phoneNumber }) : await User.findOne({ email });
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found', user);
    if (req.isLogin) {
        // check device already exists or not
        let deviceIndex = user.deviceInfo.findIndex(d => d.deviceId === deviceInfo.deviceId);
        // Update device info
        if (deviceIndex !== -1) {
            user.deviceInfo[deviceIndex].fcmToken = deviceInfo.fcmToken;
            user.deviceInfo[deviceIndex].lastLogin = new Date();
        }
        // Add new device
        else {
            const newDevice = {
                deviceId: deviceInfo.deviceId,
                deviceType: deviceInfo.deviceType,
                deviceName: deviceInfo.deviceName,
                fcmToken: deviceInfo.fcmToken,
                lastLogin: new Date()
            };
            user.deviceInfo.push(newDevice);
            user.notificationTokens = pushList(user.notificationTokens, deviceInfo.fcmToken, true);
        }
    } else {
        user.fullName = 'Chandan Kumar Singh';
        if (email) user.email = email;
        if (userAccountSettings) user.userAccountSettings = userAccountSettings;
    }
    user.lastSeen = new Date();
    user.lastLogin = new Date();
    await user.save();

    ///send login notification
    if (user.notificationTokens.length > 0) {
        sendNotification(user.notificationTokens.filter((e) => e !== deviceInfo.fcmToken), 'A new 📱 logged in', 'Change your password if this is not you.', { title: 'A new device logged in', body: 'A new device logged in' });
    }
    sendNotification(deviceInfo.fcmToken, `Hello ${user.fullName} 😊`, `Welcome to ${appName}`);

    /// subscribe to topics
    subscribeToTopic(notificationTopics.NEW_USER, deviceInfo.fcmToken);
    subscribeToTopic(notificationTopics.FIRST_PROFILE, deviceInfo.fcmToken);
    // subscribeToTopic(notification.userFollowersTopic(user._id.toString()), deviceInfo.fcmToken);
    // sendNotification(user.notificationTokens, 'Welcome to Lamat', 'Welcome to Lamat', { title: 'Welcome to Lamat', body: 'Welcome to Lamat' });
    return user;
};

const checkUserExistsWithEmailOrPhone = async (email, phoneNumber) => {
    let user = await User.findOne({
        $or: [{ email: '' }, { phoneNumber }]
    });
    return user;
}


/// create first user 
const newUserFirstProfile = async (req, res, next) => {
    const files = req.files;
    req.body.profile_pic = files.profile_pic[0].path;
    req.body.media_files = files.media_files.map(file => file.path);
    req.body.small_profile_pic = await resizeAndSaveImage(req.body.profile_pic, req.body.profile_pic, null, 250, 250);

    let { nickname, fullname, username, gender, birthDay, interests, profile_pic, media_files, small_profile_pic } = req.body;
    let user = await User.findById(req.user.id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'Your account not found', user);
    if (!username) throw new ErrorHandler(CONFLICT, 'Username is required');
    let users = await User.find({ username });
    if (users.length > 0) throw new ErrorHandler(CONFLICT, 'Username already exists');
    user.userName = username;
    user.nickname = nickname;
    user.fullName = fullname;
    user.gender = gender;
    user.birthDay = birthDay;
    user.about = about;
    user.aboutMe = aboutMe;
    if (interests) {
        if (!Array.isArray(interests)) {
            interests = interests.split(',');
        }
        user.interests = interests;
    }
    user.smallProfilePicture = small_profile_pic;
    user.profilePicture = profile_pic;
    user.mediaFiles = media_files;
    user = await user.save({ new: true });
    /// send  new user created notification
    sendNotificationToTopic(notificationTopics.NEW_USER, getTitle(notificationTopics.NEW_USER, fullname), getBody(notificationTopics.NEW_USER), { user: user._id.toString(), image: constant.imageBaseUrl + user.profilePicture });

    return {
        media_files,
        user
    };
}

/// update user profile by id
const updateUserProfileById = async (req, res, next, id) => {
    //  {_id: null, about: Hey! I am usingLamat, aboutMe: null, accountstatus: allowed, actionmessage: null, agoraToken: , audioCallMade: 0, audioCallRecieved: 0, authenticationType: null, birthDay: 953404200000, blockeduserslist: [], boostBalance: 0, boostType: , boostedOn: 0, countryCode: null, deviceInfo: null, email: null, favSongs: [], favTeels: [], fbUrl: , followers: [], followersCount: 0, following: [], followingCount: 0, fullName: Chandan, 
    //gender: other, groupsCreated: 0, id: null, instaUrl: , interests: [food, languages, travel, travel, business, health, books, gaming, learning, movies], isBoosted: false, isMultiLangNotifEnabled: null, isOnline: null, isVerified: false, bannedDate: null, bannedReason: null, isBanned: null, loginMode: null, joinedOn: 1710362094317, lastLogin: 1710362094317, lastTimeOnline: null, mediaFiles: [/data/user/0/com.abbble.lamat/cache/5b23c92a-be36-4dbc-8bd6-8cfbe50d77ef/1000197562.jpg, , , , , , , , , , , , , , ],
    // mssgSent: 0, myPostLikes: 0, nickname: Banana, notificationTokens: [cE0CWjlmS-q6MSYaPe3S-V:APA91bEL5v4aUltPjlz7MLWTwi80JfCh3n4-VKeF_A-Vhl_osXBk4dah-yec3k8BmWi9_IRuT9PioDCuUFacqjnavsi7AgRIuubQKtT6xvS0gQeLqMBu4B4xBFrIt5_diyL7gprKl0MT], phone: null, phoneNumber: null, phone_raw: null, phonenumbervariants: [+919135324545, +91-9135324545, 91-9135324545, 919135324545, 0919135324545, 09135324545, 9135324545, +9135324545, +91--9135324545, 009135324545, 00919135324545, +91-09135324545, +9109135324545, 9109135324545],
    // privateKey: null, profileCategoryName: New, profilePicture: /data/user/0/com.abbble.lamat/cache/b71f4866-ca19-4dad-a108-6990ff901a08/1000199108.jpg, publicKey: null, searchKey: B, superLikesCount: 0, totalvisitsANDROID: null, userAccountSettings: {"location":{"addressText":"Paris, France","latitude":37.42796133580664,"longitude":-122.085749655962},"minimumAge":18,"maximumAge":99}, maximumAge: null, minimumAge: null, userId: null, userName: znnaama, userPhotos: null, userVideos: null, password: null, videoCallMade: 0,
    // videoCallRecieved: 0, youtubeUrl: , createdAt: null, lastSeen: null, updatedAt: null, __v: null}
    const { about, aboutMe, accountstatus, actionmessage, agoraToken, audioCallMade, audioCallRecieved, authenticationType, birthDay, blockeduserslist, boostBalance,
        boostType, boostedOn, countryCode, deviceInfo, email, favSongs, favTeels, fbUrl, followers, followersCount, following,
        followingCount, fullName, gender, groupsCreated, instaUrl, interests, isBoosted, isMultiLangNotifEnabled, isOnline,
        isVerified, bannedDate, bannedReason, isBanned, loginMode, mediaFiles, mssgSent, myPostLikes,
        nickname, notificationTokens, phone, phoneNumber, phone_raw, phonenumbervariants, privateKey, profileCategoryName, profilePicture,
        publicKey, searchKey, superLikesCount, totalvisitsANDROID, userAccountSettings, maximumAge, minimumAge, userPhotos,
        userVideos, videoCallMade, videoCallRecieved, youtubeUrl, } = req.body;

    let user = await User.findById(id);
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found', user);
    if (about) user.about = about;
    if (aboutMe) user.aboutMe = aboutMe;
    if (accountstatus) user.accountstatus = accountstatus;
    if (actionmessage) user.actionmessage = actionmessage;
    if (agoraToken) user.agoraToken = agoraToken;
    if (audioCallMade) user.audioCallMade = audioCallMade;
    if (audioCallRecieved) user.audioCallRecieved = audioCallRecieved;
    if (authenticationType) user.authenticationType = authenticationType;
    if (birthDay) user.birthDay = birthDay;
    if (blockeduserslist) user.blockeduserslist = pushList(user.blockeduserslist, blockeduserslist, true);
    if (boostBalance) user.boostBalance += boostBalance;
    if (boostType) user.boostType = boostType;
    if (boostedOn) user.boostedOn = boostedOn;
    if (countryCode) user.countryCode = countryCode;
    if (email) user.email = email;
    if (favSongs) user.favSongs = pushList(user.favSongs, favSongs, true);
    console.log('favSongs', favSongs, user.favSongs);
    if (favTeels) user.favTeels = pushList(user.favTeels, favTeels, true);
    if (fbUrl) user.fbUrl = fbUrl;
    if (followers) user.followers = pushList(user.followers, followers, true);
    if (followersCount) user.followersCount += followersCount;
    if (following) user.following = pushList(user.following, following, true);
    if (followingCount) user.followingCount += followingCount;
    if (fullName) user.fullName = fullName;
    if (gender) user.gender = gender;
    if (groupsCreated) user.groupsCreated += groupsCreated;
    if (instaUrl) user.instaUrl = instaUrl;
    if (interests) user.interests = pushList(user.interests, interests, true);
    if (isBoosted) user.isBoosted = isBoosted;
    if (isMultiLangNotifEnabled) user.isMultiLangNotifEnabled = isMultiLangNotifEnabled;
    if (isOnline) user.isOnline = isOnline;
    if (isVerified) user.isVerified = isVerified;
    if (bannedDate) user.bannedDate = bannedDate;
    if (bannedReason) user.bannedReason = bannedReason;
    if (isBanned) user.isBanned = isBanned;
    if (loginMode) user.loginMode = loginMode;
    if (mediaFiles) user.mediaFiles = pushList(user.mediaFiles, mediaFiles, true);
    if (mssgSent) user.mssgSent += mssgSent;
    if (myPostLikes) user.myPostLikes += myPostLikes;
    if (nickname) user.nickname = nickname;
    if (notificationTokens) user.notificationTokens = pushList(user.notificationTokens, notificationTokens, true);
    if (phone) user.phone = phone;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (phone_raw) user.phone_raw = phone_raw;
    if (phonenumbervariants) user.phonenumbervariants = pushList(user.phonenumbervariants, phonenumbervariants, true);
    if (privateKey) user.privateKey = privateKey;
    if (profileCategoryName) user.profileCategoryName = profileCategoryName;
    if (profilePicture) user.profilePicture = profilePicture;
    if (publicKey) user.publicKey = publicKey;
    if (searchKey) user.searchKey = searchKey;
    if (superLikesCount) user.superLikesCount += superLikesCount;
    if (totalvisitsANDROID) user.totalvisitsANDROID = totalvisitsANDROID;
    if (userAccountSettings) user.userAccountSettings = typeof userAccountSettings === 'string' ? JSON.parse(userAccountSettings) : userAccountSettings;
    if (maximumAge) user.maximumAge = maximumAge;
    if (minimumAge) user.minimumAge = minimumAge;
    if (userPhotos) user.userPhotos = pushList(user.userPhotos, userPhotos, true);
    if (userVideos) user.userVideos = pushList(user.userVideos, userVideos, true);
    if (videoCallMade) user.videoCallMade += videoCallMade;
    if (videoCallRecieved) user.videoCallRecieved += videoCallRecieved;
    if (youtubeUrl) user.youtubeUrl = youtubeUrl;

    user = await user.save({ new: true });
    return { message: 'User updated successfully 😊', user };
}
// update last seen and isOnline
const updateLastSeen = async (req, res, next) => {
    const { isOnline, lastSeen } = req.body;
    let user = await User.findOne({ _id: req.user.id });
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found', user);
    user.isOnline = isOnline;
    user.lastSeen = new Date();
    await user.save();
    return user;
}

/// ban single user
const banUser = async (id, reason, status) => {
    console.log('id', id, reason);
    let user = await User.findByIdAndUpdate(id, { $set: { isBanned: status, bannedReason: reason, bannedDate: status ? new Date : null } }, { new: true });
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found', user);
    if (!status) {
        await fb.collection('bannedUsers').doc(id).delete();
    } else {
        await fb.collection('bannedUsers').doc(id).set({ bannedReason: reason }, { merge: true });
    }

    return user;
}


/// get blocked users list  of a user by id
const getBlockedUsers = async (req, res, next) => {
    let user = await User.findOne({ _id: req.user.id })
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found', user);
    let { limit, page } = req.query;
    const query = {};
    page = page ? page : 1;
    query.limit = limit ? parseInt(limit) : 10;
    query.skip = parseInt(query.limit) * (parseInt(page) - 1);
    let blockedUsers = await User.find({ _id: { $in: user.blockeduserslist } }, {}, query);
    return {
        query,
        total: user.blockeduserslist.length,
        limit,
        page,
        users: blockedUsers,


    };

}

//block a user by id
const blockUser = async (id, blockId) => {
    let user = await User.findOne({ _id: id });
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found', user);
    // push if not exists
    if (user.blockeduserslist.indexOf(blockId) === -1) {
        user.blockeduserslist.push(blockId);
    } else {
        throw new ErrorHandler(CONFLICT, 'User already blocked');
    }
    user = await user.save();
    return user;
}

/// get users 
const getFilteredUsers = async (req, res, next) => {
    let { limit, page, showBlocked, showBanned, excludeWhoBlockedMe } = req.body;
    const query = {};
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let me = await User.findOne({ _id: req.user.id });
    if (!showBlocked) {
        query._id = { $nin: me.blockeduserslist };
    }
    if (!showBanned) {
        query.isBanned = false;
    }
    if (excludeWhoBlockedMe) {
        // users who not blocked me
        query.blockeduserslist = { $nin: [me._id] };
    }
    const accountSetting = me.userAccountSettings;

    if (accountSetting) {
        console.log('accountSetting', accountSetting);
        const isWorldWide = accountSetting.distanceInKm === null;
        /// user gender interest
        if (accountSetting.get("interestedIn")) {
            query.gender = accountSetting.get("interestedIn");
        }

        // todo: apply distance filter 
        // const minimumAge = accountSetting.minimumAge; //20
        // const maximumAge = accountSetting.maximumAge; //34
        // const moment = require('moment');

        // // Calculate the birth dates for minimum and maximum ages
        // const minBirthDate = moment().subtract(maximumAge, 'years').toDate();
        // const maxBirthDate = moment().subtract(minimumAge, 'years').toDate();

        // // Apply the filter for birthDay
        // query.birthDay = { $gte: minBirthDate, $lte: maxBirthDate };
        // /// filter on basis of latitude and longitude if not worldwide or distance between is greater account setting distanceInKm 
        // if (!isWorldWide) {
        //     const latitude = accountSetting.latitude;
        //     const longitude = accountSetting.longitude;
        //     query.location = {
        //         $geoWithin: {
        //             $centerSphere: [[longitude, latitude], accountSetting.distanceInKm / 1000]
        //         }
        //     };
        // }
    }

    let totalUsers = await User.find(query);
    let users = await User.find(query).limit(limit).skip(limit * (page - 1));
    return {
        query,
        total: totalUsers.length,
        limit,
        page,
        todayLikes: 5,
        todaySuperLikes: 2,
        todayDislikes: 3,
        users
    };
};


/*
    *user interaction
    */
//  createInteraction
const createInteraction = async (req, res, next) => {
    const { from, to, isSuperLike, isLike, isDislike } = req.body;
    let fromUsr = await User.findById(from);
    let toUsr = await User.findById(to);
    if (!fromUsr) throw new ErrorHandler(NOT_FOUND, 'Interaction user not found');
    if (!toUsr) throw new ErrorHandler(NOT_FOUND, 'Creater user not found');
    let interaction = new UserInteraction({ from, to, isSuperLike, isLike, isDislike, createdAt: new Date() });
    interaction = await interaction.save({ isNew: true });
    return { interaction, message: 'Interaction created successfully 😊' };
}

//  getInteractions
const getInteractions = async (req, res, next) => {
    let { limit, page } = req.body;
    const query = {};
    page = page || 1;
    query.limit = limit ? parseInt(limit) : 10;
    query.skip = parseInt(query.limit) * (parseInt(page) - 1);
    const user = await User.findOne({ _id: req.user.id });
    if (!user) throw new ErrorHandler(NOT_FOUND, 'User not found', user);
    const total = await UserInteraction.find({ from: user._id }).countDocuments();
    let interactions = await UserInteraction.find({ from: user._id }, {}, query);
    return {
        total: total,
        limit,
        page,
        interactions,
    };
}

// deleterInteraction
const deleterInteraction = async (req, res, next) => {
    const { id } = req.params;
    let interaction = await UserInteraction.findByIdAndDelete(id);
    if (!interaction) throw new ErrorHandler(NOT_FOUND, 'Interaction not found', interaction);
    return { interaction, message: 'Interaction deleted successfully 😟' };
}

module.exports = {
    getAllUsers, getUserById, getUserByToken, checkUserExistsWithEmailOrPhone,

    /* 
     * new user
     */
    createUser,
    newUserFirstProfile,

    loginUser, updateUserProfileById, updateLastSeen, banUser, getBlockedUsers, blockUser, getFilteredUsers
    ,
    /*
     * user Interaction
     */
    createInteraction,
    getInteractions,
    deleterInteraction
};