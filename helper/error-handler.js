class ErrorHandler extends Error {
    constructor(statusCode, message, args) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        if (!args) {
            if (Array.isArray(args) && args.length !== 0) {
                this.args = args;
            }
        } else {
            this.args = args;
        }
    }
}

module.exports = {
    ErrorHandler,
};
