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

/**
 * returns a "copy" of the global config to avoid direct manipulation of the config.
 */
const readGlobalConfig = () => Object.assign({}, GLOBAL_CONFIG);

/**
 * Can be called to configure the validation globally. This function can only be called once.
 * Possible options are: stripUnkown, abortEarly and useExpress.
 *
 * @param opts A config object. Will be merged with the global configuration.
 */
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
