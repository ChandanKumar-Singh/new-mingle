// const express = require("express");
// const router = express.Router();

// const { dispatcher } = require("../../../middleware");
// const { users } = require("../../../helper");

// const {
//     activeUsers,
//     inActiveUsers,
//     getUserDetails,
//     getUserTree
// } = require("../../../controllers/v1");


// const { USER } = users

// router.post("/tree", (req, res, next) => dispatcher(req, res, next, getUserTree, [USER]));

// router.post("/details", (req, res, next) => dispatcher(req, res, next, getUserDetails, [USER]));

// router.post("/active", (req, res, next) => dispatcher(req, res, next, activeUsers, [USER]));

// router.post("/inactive", (req, res, next) => dispatcher(req, res, next, inActiveUsers, [USER]));

// module.exports = router;