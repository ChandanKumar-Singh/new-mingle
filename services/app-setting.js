const remoteConfig = require('../services/remoteConfig');
const { ErrorHandler } = require('../helper');
const { OK, CONFLICT } = require('../helper/status-codes');
const AppSetting = require('../models/appsetting');
const getAppSetting = async () => {
    let data = [];
    data = await AppSetting.find();
    if (!data || data.length === 0) throw new ErrorHandler(OK, 'Setting not found');
    return data[0];
}

/// add new setting
const addAppSetting = async (body) => {
    const isExist = await AppSetting.find();
    if (isExist && isExist.length > 0) {
        throw new ErrorHandler(CONFLICT, 'Setting already exist');
    }
    const setting = new AppSetting(body);
    await setting.save();
    const { baseUrl, imageBaseUrl } = body;
    // TODO: update remote config
    // if (baseUrl) await remoteConfig.updateRemoteConfig({ baseUrl });
    // if (imageBaseUrl) await remoteConfig.updateRemoteConfig({ imageBaseUrl });
    return setting;
}

/// update setting
const updateAppSetting = async (body) => {
    let setting = await AppSetting.find();
    if (!setting || setting.length === 0) {
        throw new ErrorHandler(OK, 'Setting not found');
    }
    setting = setting[0];
    Object.keys(body).forEach(key => {
        setting[key] = body[key];
    });
    await setting.save();
    const { baseUrl, imageBaseUrl } = body;
    // TODO: update remote config
    // if (baseUrl) await remoteConfig.updateRemoteConfig('baseUrl', baseUrl);
    // if (imageBaseUrl) await remoteConfig.updateRemoteConfig({ imageBaseUrl });
    return setting;
}

/// update app logos
const updateAppLogos = async (req, res, next) => {
}

module.exports = { getAppSetting, addAppSetting, updateAppSetting, updateAppLogos };