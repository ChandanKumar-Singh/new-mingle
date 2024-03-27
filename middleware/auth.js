const jwt = require("jsonwebtoken");
const { OK, UNAUTHORIZED } = require("../helper/status-codes");
const { ErrorHandler } = require("../helper");

/**
 *
 * Auth middleware checks if token is available in the header, is it's unavailable isAuth is passed as false,
 * isAuth is false even if there's error in decoding the token.
 *
 * User is shown unauthorized here. This middleware only check if user is authenticated or not.
 *
 * @param {*} req -> Express request object
 * @param {*} res -> Express response object
 * @param {*} next -> Express middleware next function
 * @returns
 */

const check = async (req, res, next) => {
    let token = req.header('Authorization')
    token = token ? token.split(' ')[1] : null;
    let user = { isAuth: false };
    req.user = user;
    if (!token) return next();
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY, { ignoreExpiration: true });
    } catch (err) {
        console.log(err);
        return next(err);
    }

    if (!decoded) return next();
    let isExpired = decoded.exp < Date.now() / 1000;
    if (isExpired) return res.status(UNAUTHORIZED).send({ status: false, isLoggedIn: 0, message: "Your session has expired. Please login again." });

    user = { ...user, isAuth: true, ...decoded, token };
    req.user = user;
    // console.log('User', user, req.body);
    return next();
};

const createToken = (data) => {
    return jwt.sign(data, process.env.JWT_PRIVATE_KEY, { expiresIn: "7d" });
}
module.exports = { check, createToken };