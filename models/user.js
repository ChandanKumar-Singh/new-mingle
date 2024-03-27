const mongoose = require('mongoose');
const { comparePassword, hashPassword } = require('../utils/hash');

const userSchema = new mongoose.Schema({
    about: {
        type: String, default: ''
    },
    aboutMe: {
        type: String, default: ''
    },
    accountstatus: {
        type: String, default: 'allowed'
    },
    actionmessage: {
        type: String, default: 'User Approval granted!'
    },
    agoraToken: {
        type: String, default: ''
    },
    audioCallMade: {
        type: Number, default: 0
    },
    audioCallRecieved: {
        type: Number, default: 0
    },
    authenticationType: {
        type: Number, default: 0
    },
    birthDay: {
        type: String,
        default: ''
    },
    blockeduserslist: {
        type: [
            mongoose.Schema.Types.ObjectId
        ],
        ref: 'User',
        default: []
    },
    boostBalance: {
        type: Number, default: 0
    },
    boostType: {
        type: String, default: ''
    },
    boostedOn: {
        type: Number, default: 0
    },
    countryCode: {
        type: String, default: '+91'
    },
    deviceInfo: {
        type: [
            {
                deviceId: {
                    type: String,
                    required: true
                },
                deviceName: {
                    type: String,
                    required: true
                },
                deviceType: {
                    type: String,
                    enum: ['iOS', 'android', 'web', 'others', 'windows', 'mac'],
                    required: true,
                },
                lastLogin: {
                    type: Date,
                    default: Date()
                },
                fcmToken: {
                    type: String,
                    required: true
                },
            },],
        default: [],
        validate: [v => v.length <= 10, 'Only 3 devices are allowed per user']

    },
    email: {
        type: String, default: ''
    },
    favSongs: {
        type: [String], default: []
    },
    favTeels: {
        type: [String], default: []
    },
    fbUrl: {
        type: String, default: ''
    },
    followers: {
        type: [String], default: []
    },
    followersCount: {
        type: Number, default: 0
    },
    following: {
        type: [String], default: []
    },
    followingCount: {
        type: Number, default: 0
    },
    fullName: {
        type: String, default: ''
    },
    gender: {
        type: String,

        enum: ['male', 'female', 'other']
    },
    groupsCreated: {
        type: Number, default: 0
    },
    instaUrl: {
        type: String, default: ''
    },
    interests: {
        type: [String], default: []
    },
    isBoosted: {
        type: Boolean, default: false
    },
    isMultiLangNotifEnabled: {
        type: Boolean, default: true
    },
    isOnline: {
        type: Boolean, default: false,
        required: [true, 'isOnline is required']
    },
    isBanned: {
        type: Boolean, default: false
    },
    bannedReason: {
        type: String,
    },
    bannedDate: {
        type: Date
    },
    isDeleted: {
        type: Boolean, default: false
    },
    isVerified: {
        type: Boolean, default: true
    },
    loginMode: {
        type: String,
        required: [true, 'Login mode is required'],
        enum: ['email', 'phone', 'facebook', 'google'],
    },
    lastLogin: {
        type: Date, default: Date()
    },
    lastSeen: {
        type: Date
    },
    lastTimeOnline: {
        type: Date
    },
    mediaFiles: {
        type: [String], default: []
    },
    mssgSent: {
        type: Number, default: 0
    },
    myPostLikes: {
        type: Number, default: 0
    },
    nickname: {
        type: String, default: ''
    },
    notificationTokens: {
        type: [String], default: []
    },
    notificationsMap: {
        type: Map, of: String, default:
            {}
    },
    phone: {
        type: String, default: ''
    },
    phoneNumber: {
        type: String, default: ''
    },
    phone_raw: {
        type: String, default: ''
    },
    phonenumbervariants: {
        type: [String], default: []
    },
    privateKey: {
        type: String, default: ''
    },
    profileCategoryName: {
        type: String, default: ''
    },
    smallProfilePicture: {
        type: String, default: ''
    },
    profilePicture: {
        type: String, default: ''
    },
    publicKey: {
        type: String, default: ''
    },
    searchKey: {
        type: String, default: ''
    },
    superLikesCount: {
        type: Number, default: 0
    },
    totalvisitsANDROID: {
        type: Number, default: 0
    },
    userAccountSettings: {
        type: Map, of: mongoose.Schema.Types.Mixed, default: {}
    },
    location: {
        type: {
            addressText: {
                type: String, default: ''
            },
            latitude: {
                type: Number, default: 0
            },
            longitude: {
                type: Number, default: 0
            }
        },
        default: {}
    },
    maximumAge: {
        type: Number, default: 99
    },
    minimumAge: {
        type: Number, default: 18
    },
    userId: {
        type: String, default: ''
    },
    userName: {
        type: String, default: ''
    },
    userPhotos: {
        type: [String], default: []
    },
    userVideos: {
        type: [String], default: []
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    videoCallMade: {
        type: Number, default: 0
    },
    videoCallRecieved: {
        type: Number, default: 0
    },
    youtubeUrl: {
        type: String, default: ''
    },
    lastSeen: {
        type: Date,
        default: Date()
    },


}, { timestamps: true });


userSchema.methods.isValidPassword = async function (password) {
    return await comparePassword(this.password, password.toString());
}

// hash password before saving to database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await hashPassword(this.password);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
