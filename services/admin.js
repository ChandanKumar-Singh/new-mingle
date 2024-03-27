const { asyncCall } = require('../utils/helper');
const  Admin = require('../models/admin');
const { ErrorHandler } = require('../helper');
const { OK, NOT_FOUND } = require('../helper/status-codes');

const getAdmins = async (req, res, next) => asyncCall(async () => {
    let data = await Admin.find().select('-password');
    if (!data || data.length === 0) throw new ErrorHandler(OK, 'Admin not found', data);
    return data;
}, next);

/// add new admin
const addAdmin = async (req, res, next) => {
    const { name, email, isSuperAdmin, permissions, deviceInfo, password } = req.body;
    deviceInfo.lastLogin = new Date();
    let admin = new Admin({ name, email, isSuperAdmin, permissions, deviceInfo, password });
    await admin.save();
    return admin;
};

/// update admin
const updateAdmin = async (req, res, next) => {
    const { name, email, isSuperAdmin, permissions, deviceInfo, password } = req.body;
    let admin = await Admin.findOne({ email });
    if (!admin) throw new ErrorHandler(NOT_FOUND, 'Admin not found', admin);

    if (req.isLogin) {
        // check device already exists or not
        let deviceIndex = admin.deviceInfo.findIndex(d => d.deviceId === deviceInfo.deviceId);
        console.log('deviceInfo.fcmToken', deviceInfo.fcmToken, deviceIndex);
        // Update device info
        if (deviceIndex !== -1) {
            admin.deviceInfo[deviceIndex].fcmToken = deviceInfo.fcmToken;
            admin.deviceInfo[deviceIndex].lastLogin = new Date();
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
            admin.deviceInfo.push(newDevice);
        }
        admin.lastLogin = new Date();
    } else {
        admin.name = name;
        admin.email = email;
        admin.isSuperAdmin = isSuperAdmin;
        admin.permissions = permissions;
    }
    if (!password) admin.password = password;
    await admin.save();
    return admin;
};


/// delete admin
const deleteAdmin = async (req, res, next) => asyncCall(async () => {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) throw new ErrorHandler(NOT_FOUND, 'Admin not found', admin);
    await admin.remove();
    return admin;
}, next);


/// admin notification
const addNewAdminNotification = async (req, res, next) => asyncCall(async () => {
    // DbPaths.adminnotifications)
    //       .update({
    //     Dbkeys.nOTIFICATIONxxaction: 'PUSH',
    //     Dbkeys.nOTIFICATIONxxdesc: widget.prefs
    //                 .getBool(Dbkeys.isaccountapprovalbyadminneeded) ==
    //             true
    //         ? '$phoneNo has Joined ${AppConfig.appName}. APPROVE the user account. You can view the user profile from All Users List.'
    //         : '$phoneNo has Joined ${AppConfig.appName}. You can view the user profile from All Users List.',
    //     Dbkeys.nOTIFICATIONxxtitle: 'User Joined',
    //     Dbkeys.nOTIFICATIONxximageurl: null,
    //     Dbkeys.nOTIFICATIONxxlastupdate: DateTime.now(),
    //     'list': FieldValue.arrayUnion([
    //       {
    //         Dbkeys.docid: DateTime.now().millisecondsSinceEpoch.toString(),
    //         Dbkeys.nOTIFICATIONxxdesc: widget.prefs
    //                     .getBool(Dbkeys.isaccountapprovalbyadminneeded) ==
    //                 true
    //             ? '$phoneNo has Joined ${AppConfig.appName}. APPROVE the user account. You can view the user profile from All Users List.'
    //             : '$phoneNo has Joined ${AppConfig.appName}. You can view the user profile from All Users List.',
    //         Dbkeys.nOTIFICATIONxxtitle: 'User Joined',
    //         Dbkeys.nOTIFICATIONxximageurl: null,
    //         Dbkeys.nOTIFICATIONxxlastupdate: DateTime.now(),
    //         Dbkeys.nOTIFICATIONxxauthor: '${phoneNo}XXXuserapp',
    //       }
    //     ])
    //   });
}, next);




module.exports = { getAdmins, addAdmin, updateAdmin, deleteAdmin };
