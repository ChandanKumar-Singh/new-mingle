const { walletController } = require('../../controllers');
const { role } = require('../../helper');
const { dispatcher } = require('../../middleware');

const router = require('express').Router();

router.post('/createWallet', (req, res, next) => dispatcher(req, res, next, walletController.createWallet, [role.USER, role.ADMIN]));

router.post('/addWalletBalance', (req, res, next) => dispatcher(req, res, next, walletController.addWalletBalance, [role.USER, role.ADMIN]));

router.get('/getWallet/:userId', (req, res, next) => dispatcher(req, res, next, walletController.getWalleyByUserId, [role.USER, role.ADMIN]));

module.exports = router;