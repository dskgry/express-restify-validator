//@flow
/**
 * @author dskgry
 */
const assert = require('./assert');

const GLOBAL_CONFIG: Config = {
    stripUnknown: true,
    abortEarly: false,
    useExpress: true,
};

let configureCalled = false;

const readGlobalConfig = () => Object.assign({}, GLOBAL_CONFIG); //return "copy" to avoid direct modification

const configure = (opts?: Config = GLOBAL_CONFIG) => {
    if (configureCalled) {
        throw new Error(`
            Global configuration must only be done once :). 
            You can always change settings on route level, e.g. validate.queryParams(shape,config).
            Changing the engine is not possible.
        `);
    }

    if (assert.isObject(opts)) {
        Object.assign(GLOBAL_CONFIG, opts);
    }

    configureCalled = true;
};

module.exports = {
    configure,
    readGlobalConfig,
};