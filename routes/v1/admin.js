const router = require('express').Router();
const { dispatcher } = require('../../middleware');
const { role } = require('../../helper');
const { adminController } = require('../../controllers');
const service = require('../../services');

/// get all settings
router.get('/getAllAdmins', (req, res, next) => dispatcher(req, res, next, adminController.auth.getAllAdmins, []));

/// get all users
router.get('/getUsers', (req, res, next) => dispatcher(req, res, next, adminController.user.getAllUsers, []));

/// add new setting
router.post('/login', (req, res, next) => dispatcher(req, res, next, adminController.auth.login, []));

/// register
router.post('/register', (req, res, next) => dispatcher(req, res, next, adminController.auth.register, []));

/// update setting
router.put('/update', (req, res, next) => dispatcher(req, res, next, adminController.auth.update, [role.SUPER_ADMIN]));

/// ban single user
router.post('/banUser', (req, res, next) => dispatcher(req, res, next, adminController.user.banUser, []));









/// app setting
router.get('/getAppSettings', (req, res, next) => dispatcher(req, res, next, adminController.app.getAppSettings));
router.post('/addAppSettings', (req, res, next) => dispatcher(req, res, next, adminController.app.addAppSettings, [role.SUPER_ADMIN]));
router.put('/updateAppSettings', (req, res, next) => dispatcher(req, res, next, adminController.app.updateAppSettings, [role.SUPER_ADMIN]));
router.post('/updateAppLogos', (req, res, next) => dispatcher(req, res, next, adminController.app.updateAppLogos, [role.SUPER_ADMIN]));

module.exports = router;