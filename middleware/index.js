const validateToken = require('./auth')
// const validator = require('./validator')
const dispatcher = require('./dispatcher')
const handleError = require('./handle-error')
const userReqValidator = require('./userReqValidator')

module.exports = {
    validateToken,
    // validator,
    dispatcher,
    handleError,
    userReqValidator
}