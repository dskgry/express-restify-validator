//@flow
/**
 * @author @dskgry
 */
const restify = require('restify');

const restifyServer = restify.createServer();
restifyServer.use(restify.plugins.queryParser());
restifyServer.use(restify.plugins.bodyParser());

module.exports = restifyServer;
