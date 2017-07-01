//@flow
/**
 * @author dskgry
 */

const yup = require('yup');

let configureCalled = false;

const GLOBAL_CONFIG: Config = {
    stripUnknown: true,
    abortEarly: false,
    useExpress: true,
};


const readConfig = () => GLOBAL_CONFIG;

const isObject = toAssert => typeof toAssert === 'object' && toAssert !== null;

const configure = (opts?: Config = GLOBAL_CONFIG) => {
    if (configureCalled) {
        throw new Error(`
            Global configuration must only be done once :). 
            You can always change settings on route level, e.g. validate.queryParams(shape,config).
            Changing the engine is not possible.
        `);
    }

    if (isObject(opts)) {
        Object.assign(GLOBAL_CONFIG, opts);
    }

    configureCalled = true;
};


const collectErrors = (e: ValidationErrorType, config: Config): Object => {
    if (config.abortEarly) {
        return {
            [e.path]: e.errors,
        };
    }
    return e.inner.reduce((errors, currentValidation) => Object.assign(errors, {[currentValidation.path]: currentValidation.errors}), {});
};

const queryParams = (shape: YupShape = {}, options?: ?Config = GLOBAL_CONFIG) => async (req: (express$Request | RestifyRequest),
                                                                                        res: (express$Response | RestifyResponse),
                                                                                        next: (express$NextFunction | RestifyNextFunction)): Promise<void> => {
    const config = Object.assign({}, GLOBAL_CONFIG, options);
    try {
        const validated = await yup.object().shape(shape).validate(req.query, config);

        Object.assign((req: any), {
            query: validated,
            origQuery: req.query
        });

        next();
    } catch (e) {
        if (GLOBAL_CONFIG.useExpress) {
            const expressResponse: express$Response = (res: any);
            expressResponse.status(400).json(collectErrors(e, config));
        } else {
            const restifyResponse: RestifyResponse = (res: any);
            restifyResponse.json(400, collectErrors(e, config));
        }
    }
};


module.exports = {
    queryParams,
    yup,
    configure,
    readConfig,
};
