// const express = require("express");
// const router = express.Router();

// const { dispatcher } = require("../../../middleware");
// const { users } = require("../../../helper");

// const {
//     userAllDetails,
//     widthdrawalBalance,
//     history,
// } = require("../../../controllers/v1");


// const { USER } = users

// router.post("/", (req, res, next) => dispatcher(req, res, next, userAllDetails, [USER]));

// router.put("/widthdrawal", (req, res, next) =>
//     dispatcher(req, res, next, widthdrawalBalance, [USER])
// );

// router.post("/history", (req, res, next) =>
//     dispatcher(req, res, next, history, [USER])
// );


// module.exports = router;