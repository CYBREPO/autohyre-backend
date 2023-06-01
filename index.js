const express = require('express');
const { dbConnect } = require('./lib/dbconnect');
const cors = require('cors');

const server = express();
const path = require('path');
const port = process.env.port;
server.use(cors({
    credentials: true,
    origin: ["http://localhost:60727"]
}))

server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));
dbConnect();
server.use('/api/vehicle', require('./routers/vehicle-routers').router);
server.use('/api/brand', require('./routers/brand-router').router);

server.listen((port??'8080'), () => {
    console.log("Start")
});