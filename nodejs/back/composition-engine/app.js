/**
 * Created by Quentin on 1/6/2016.
 */

var express = require("express"),
    router = require("./composition_router"),
    app = express(),
    bodyParser = require('body-parser'),
    widget = require('./widget');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use("/", router);


app.listen(8084);
console.log('Composition engine is now listening on port 8084.');
