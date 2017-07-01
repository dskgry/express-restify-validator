/**
 * @author @dskgry
 */
const restify = require('restify');

const restifyServer = restify.createServer();
restifyServer.use(restify.plugins.queryParser());

module.exports = restifyServer;
