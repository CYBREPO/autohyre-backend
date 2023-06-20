const express = require('express');
const { dbConnect } = require('./lib/dbconnect');
const cors = require('cors');

const server = express();
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');
const port = process.env.PORT;
var bodyParser = require('body-parser')

//middleware
server.use(cors({
    credentials: true,
    origin: '*'
}));

server.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "1024mb",
        parameterLimit: 10240000
    })
)

server.use(express.json());
server.use(express.static(path.join(__dirname, 'uploads')));
server.use(errorHandler);

//database connect
dbConnect();

//routes
server.use('/api/vehicle', require('./routers/vehicle-routers').router);
server.use('/api/brand', require('./routers/brand-router').router);
server.use('/api/location', require('./routers/location-router').router);
server.use('/api/email', require('./routers/email-router').router);
server.use('/api/host', require('./routers/host-router').router);
server.use('/api/account', require('./routers/account').router);
server.use('/api/teams', require('./routers/teams-router').router);
server.use('/api/pages', require('./routers/page-router').router);

//port
server.listen((port), () => {
    console.log("Start on port", port);
});