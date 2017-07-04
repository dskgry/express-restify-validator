//     
/**
 * @author dskgry
 */

const yup = require('yup');
const configuration = require('./configuration');
const validate = require('./validate');

module.exports = {
    yup,
    query: validate.query,
    body: validate.body,
    configure: configuration.configure,
    readGlobalConfig: configuration.readGlobalConfig,
};
