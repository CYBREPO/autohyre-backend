const express = require('express');
const { dbConnect } = require('./lib/dbconnect');
const cors = require('cors');

const server = express();
const path = require('path');
const port = process.env.PORT;
server.use(cors({
    credentials: true,
    origin: ["http://localhost:2830","http://63.250.40.218"]
}))

server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));
dbConnect();
server.use('/api/vehicle', require('./routers/vehicle-routers').router);
server.use('/api/brand', require('./routers/brand-router').router);
server.use('/api/location', require('./routers/location-router').router);
server.use('/api/email', require('./routers/email-router').router);

server.listen((port), () => {
    console.log("Start on port",port);
});