#!/usr/bin/env node
import app = require('./src/app');
import http = require('http');

const port = process.env.port || 5200;

app.set('port', port);
const server = http.createServer(app);

server.listen(port);