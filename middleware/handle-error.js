
const { constant, fileUpload } = require("../utils");
const { statusCodes } = require("../helper");

const { FAILURE } = constant;
const { BAD_GATEWAY } = statusCodes;

/**
 *
 * This middleware checks the centralised error handling. All the error thrown by the controllers is handled
 * by this middleware.
 *
 *
 * @param {*} err -> Custom Error Handler
 * @param {*} res -> Express response object
 */
const { ValidationError } = require('mongoose');
const { SERVER_ERROR } = require("../helper/status-codes");

const handleError = (err, req, res) => {
    let args = err.args;
    console.log(err);
    // check if req has any file 

   fileUpload.deleteFilesFromRequest(req);
    try {
        let statusCode = err.statusCode ?? BAD_GATEWAY; // Default status code
        let error = null;
        // Check if the error has a ValidationError property
        if (err.name === 'ValidationError') {
            error = Object.keys(err.errors).map(field => {
                console.log("Error : ", err.errors[field]);
                let path = err.errors[field].path;
                let kind = err.errors[field].kind;
                if (kind === 'required') {
                    return `${path} is required`;
                } else if (kind === 'unique') {
                    return `${path} already exists`;
                }
                return err.errors[field].message;
            });
        } else if (err.name === 'CastError') {
            error = 'Invalid Id';
        }
        else if (err.name === 'TokenExpiredError') {
            error = 'Your session has expired. Please login again';
        }

        ///MulterError 
        else if (err.name === 'MulterError') {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                error = `${err.field} field issue`;
            }
        }
        else {
            error = err.message;
        }

        // console.error("Error : ", err);
        res.status(statusCode).json({
            status: false,
            statusCode,
            error,
            ...args
        });
    }
    catch (err) {
        res.status(SERVER_ERROR).json({
            status: false,
            statusCode: SERVER_ERROR,
            error: "Internal Server Error",
            log: err,
            ...args
        });
    }
};

module.exports = handleError;


