const appsetting = require('../../services/app-setting');
const { asyncCall } = require('../../utils/helper');

const getAppSettings = async (req, res, next) => asyncCall(async () => {
    const result = await appsetting.getAppSetting();
    return result;
}, next);

/// add new setting
const addAppSettings = async (req, res, next) => asyncCall(async () => {
    const result = await appsetting.addAppSetting(req.body);
    return result;
}, next);

const updateAppSettings = async (req, res, next) => asyncCall(async () => {
    const result = await appsetting.updateAppSetting(req.body);
    return result;
}, next);

/// updateAppLogos
const updateAppLogos = async (req, res, next) => asyncCall(async () => {
    const result = await appsetting.updateAppLogos(req, res, next);
    return result;
}, next);




module.exports = {
    getAppSettings,
    addAppSettings,
    updateAppSettings,
    updateAppLogos,
}