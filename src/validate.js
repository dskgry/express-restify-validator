//@flow
/**
 * @author dskgry
 */
const yup = require('yup');
const configuration = require('./configuration');
const assert = require('./assert');
const errors = require('./errors');


const validate = async (shape: YupShape,
                        options: Config,
                        req: (express$Request | RestifyRequest),
                        res: (express$Response | RestifyResponse)): Promise<?{}> => {
    const globalConfig = configuration.readGlobalConfig();
    const config = Object.assign({}, globalConfig, options, {useExpress: globalConfig.useExpress});
    try {
        const validated = await yup.object().shape(shape).validate(req.query, config);
        return Promise.resolve(validated);
    } catch (validationErrors) {
        errors.sendValidationErrors(validationErrors, config, res);
        return Promise.resolve(); //to avoid empty catch blocks
    }
};

const query = (queryShape: YupShape = {},
               options?: Config = configuration.readGlobalConfig()) => async (req: (express$Request | RestifyRequest),
                                                                              res: (express$Response | RestifyResponse),
                                                                              next: (express$NextFunction | RestifyNextFunction)): Promise<void> => {
    const validatedQueryParams = await validate(queryShape, options, req, res);
    if (assert.isObject(validatedQueryParams)) {
        Object.assign((req: any), {query: validatedQueryParams, origQuery: req.query,});
        next();
    }
};

const body = (bodyShape: YupShape = {},
              options?: Config = configuration.readGlobalConfig()) => async (req: (express$Request | RestifyRequest),
                                                                             res: (express$Response | RestifyResponse),
                                                                             next: (express$NextFunction | RestifyNextFunction)): Promise<void> => {
    const validatedQueryParams = await validate(bodyShape, options, req, res);
    if (assert.isObject(validatedQueryParams)) {
        Object.assign((req: any), {body: validatedQueryParams, origBody: req.query,});
        next();
    }
};


module.exports = {
    query,
    body,
};