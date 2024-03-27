// const express = require("express");
// const router = express.Router();

// const { dispatcher } = require("../../../middleware");
// const { users } = require("../../../helper");

// const {
//     login,
//     changePassword,
//     updateUserDetails
// } = require("../../../controllers/v1");


// const { USER } = users

// router.post("/", (req, res, next) => dispatcher(req, res, next, login));

// router.put("/change-password", (req, res, next) =>
//     dispatcher(req, res, next, changePassword, [USER])
// );

// router.put("/update-user", (req, res, next) =>
//     dispatcher(req, res, next, updateUserDetails, [USER])
// );

// module.exports = router;