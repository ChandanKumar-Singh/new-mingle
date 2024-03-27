const mongoose = require('mongoose');

const appSettingSchema = new mongoose.Schema({
    accountApprovalMessage: {
        type: String,
        default: 'Account Approved'
    },
    appShareMessageStringAndroid: {
        type: String,
        required: true
    },
    appShareMessageStringiOS: {
        type: String,
        required: true
    },
    broadcastMembersLimit: {
        type: Number,
        default: 999,
        min: 1
    },
    favIcon: {
        type: String,
        default: ''
    },
    appLogo: {
        type: String,
        default: ''
    },
    baseUrl: {
        type: String,
    },
    imageBaseUrl: {
        type: String,
    },
    feedbackEmail: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email format'
        }
    },
    groupMembersLimit: {
        type: Number,
        default: 200,
        min: 1
    },
    is24hrsTimeFormat: {
        type: Boolean,
        default: true
    },
    isAllowCreatingBroadcasts: {
        type: Boolean,
        default: true
    },
    isAllowCreatingGroups: {
        type: Boolean,
        default: true
    },
    isAllowCreatingStatus: {
        type: Boolean,
        default: true
    },
    isCallFeatureTotallyHide: {
        type: Boolean,
        default: false
    },
    isCustomAppShareLink: {
        type: Boolean,
        default: true
    },
    isLogoutButtonShowInSettingsPage: {
        type: Boolean,
        default: true
    },
    isPercentProgressShowWhileUploading: {
        type: Boolean,
        default: true
    },
    isWebCompatible: {
        type: Boolean,
        default: false
    },
    isAccountApprovalByAdminNeeded: {
        type: Boolean,
        default: false
    },
    isAdMobShow: {
        type: Boolean,
        default: true
    },
    isAppUnderConstructionAndroid: {
        type: Boolean,
        default: false
    },
    isAppUnderConstructioniOS: {
        type: Boolean,
        default: false
    },
    isAppUnderConstructionWeb: {
        type: Boolean,
        default: false
    },
    isBlockNewLogins: {
        type: Boolean,
        default: false
    },
    isCallsAllowed: {
        type: Boolean,
        default: true
    },
    isEmlAlwd: {
        type: Boolean,
        default: true
    },
    isMediaMessageAllowed: {
        type: Boolean,
        default: true
    },
    isTextMessageAllowed: {
        type: Boolean,
        default: true
    },
    latestAppVersionAndroid: {
        type: String,
        default: '1.0.0'
    },
    latestAppVersioniOS: {
        type: String,
        default: '1.0.0'
    },
    latestAppVersionWeb: {
        type: String,
        default: '1.0.0'
    },
    maintenanceMessage: {
        type: String,
        default: 'Running System Upgrading! Please check back later'
    },
    maxFileSizeAllowedInMB: {
        type: Number,
        default: 250,
        min: 1
    },
    maxNoOfContactsSelectForForward: {
        type: Number,
        default: 29,
        min: 1
    },
    maxNoOfFilesInMultiSharing: {
        type: Number,
        default: 29,
        min: 1
    },
    newAppLinkAndroid: {
        type: String,
        default: 'https://google.com'
    },
    newAppLinkiOS: {
        type: String,
        default: 'https://google.com'
    },
    newAppLinkWeb: {
        type: String,
        default: 'https://google.com'
    },
    ppl: {
        type: String,
        default: 'https://google.com'
    },
    pplType: {
        type: String,
        enum: ['url', 'other'],
        default: 'url'
    },
    statusDeleteAfterInHours: {
        type: Number,
        default: 24,
        min: 1
    },
    tnc: {
        type: String,
        default: 'https://google.com'
    },
    tncType: {
        type: String,
        enum: ['url', 'other'],
        default: 'url'
    },

    isChattingEnabledBeforeMatch: {
        type: Boolean,
        default: true
    },
    admobBanner: {
        type: String,
        default: ''
    },
    admobInt: {
        type: String,
        default: ''
    },
    admobIntIos: {
        type: String,
        default: ''
    },

    admobIntIos: {
        type: String,
        default: ''
    },
    admobBannerIos: {
        type: String,
        default: ''
    },
    maxUploadDaily: {
        type: Number,
        default: 5,
        min: 1
    },
    liveMinViewers: {
        type: Number,
        default: 1,
        min: 1
    },
    liveTimeout: {
        type: Number,
        default: 60,
        min: 1
    },
    rewardVideoUpload: {
        type: Number,
        default: 3,
        min: 1
    },
    minFansForLive: {
        type: Number,
        default: 1,
        min: 1
    },
    minFansVerification: {
        type: Number,
        default: 1,
        min: 1
    },
    minRedeemCoins: {
        type: Number,
        default: 5,
        min: 1
    },
    minWithdrawal: {
        type: Number,
        default: 5,
        min: 1
    },
    coinValue: {
        type: Number,
        default: 0.5,
        min: 0.1
    },
    dailyWithdrawalLimit: {
        type: Number,
        default: 999,
        min: 1
    },
    currency: {
        type: String,
        default: 'USD'
    },
    agoraAppId: {
        type: String,
        default: ''
    },
    agoraAppCert: {
        type: String,
        default: ''
    }



}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the model
const AppSetting = mongoose.model('AppSettings', appSettingSchema);

module.exports = AppSetting;


/// add below fields to schema
// add some more fields to above appsetting schema
// "isChattingEnabledBeforeMatch": true,
// "admobBanner": "",
// "admobInt": "",
// "admobIntIos": "",
// "admobBannerIos": "",
// "maxUploadDaily": 5,
// "liveMinViewers": 1,
// "liveTimeout": 60,
// "rewardVideoUpload": 3,
// "minFansForLive": 1,
// "minFansVerification": 1,
// "minRedeemCoins": 5,
// "minWithdrawal": 5,
// "coinValue": 0.5,
// "dailyWithdrawalLimit": 999,
// "currency": "USD",
// "agoraAppId": "",
// "agoraAppCert": ""

