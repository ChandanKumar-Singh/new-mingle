const express = require('express');
const morgan = require('morgan');
const db = require('./config/db');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const routes = require('./routes');
const multer = require('multer');
dotenv.config({
    path: path.join(__dirname, `.env.${process.env.NODE_ENV}`)
});

/// set the app
const app = express();

/// set the db
db();

/// set the body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/// set the api version
const { v1 } = routes;
/// set the middleware
const { validateToken, handleError } = require("./middleware");
const { constant } = require('./utils');

app.use(morgan("tiny"));

/// set body parser
app.use(validateToken.check);

app.use("/public", express.static(path.join(__dirname, "public")));

const noneUpload = multer().any();

/// Route for API v1

/// set the routes
app.get('/', (req, res) => {
    res.send(`Hello World ${constant.appName} from ${process.env.NODE_ENV} environment `);
});
app.use("/v1", v1);

app.use((err, req, res, next) => {
    handleError(err, req, res);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}).on('error', (err) => {
    console.log('Error: ', err);
});
