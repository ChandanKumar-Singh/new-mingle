const { ErrorHandler } = require("./error-handler");
const { UNAUTHORIZED } = require("./status-codes");

const checkAuth = user => {
    // console.log("checkAuth : ", !user || user.isAuth !== true);
    if (!user || user.isAuth !== true) throw new ErrorHandler(UNAUTHORIZED, "Unauthorized");
};

const checkUserType = (roles, allowedUserAccess) => {
    const isAllowed = checkAllowedUsers(allowedUserAccess, roles);
    if (!isAllowed) throw new ErrorHandler(UNAUTHORIZED, "Unauthorized");
};

const checkAllowedUsers = (allowedUsers, roles) => {
    for (const user of allowedUsers) {
        if (!Object.values(roles).includes(user)) return false;
    }
    return true;
};



// Check if allowedUserAccess is in roles

module.exports = {
    checkAuth,
    checkUserType,
};
