/**
 * @author @dskgry
 */
const express = require('express');
const bodyParser = require('body-parser');

const expressServer = express();
expressServer.use(bodyParser.json());

module.exports = expressServer;
