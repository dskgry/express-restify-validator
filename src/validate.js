//@flow
/**
 * @author dskgry
 */
const yup = require('yup');
const configuration = require('./configuration');
const errors = require('./errors');

/**
 * Performs the validation using yup. Calls next on success and sends an error json object with status 400 when validation fails.
 * @param shape An object that defines the yup-shape
 * @param what What are we goin to validate? (e.g. body, query or param)
 * @param options Configuration for this validation (e.g. abortEarly:true)
 * @param req The restify or express request instance
 * @param res The restify or express response instance
 * @param next The restify or express next handler function
 * @returns {Promise.<void>}
 */
const validate = async (shape: YupShape,
                        what: 'query' | 'body',
                        options: Config,
                        req: (express$Request | RestifyRequest),
                        res: (express$Response | RestifyResponse),
                        next: (express$NextFunction | RestifyNextFunction)): Promise<void> => {
    const globalConfig = configuration.readGlobalConfig();
    const config = Object.assign({}, globalConfig, options, {
        useExpress: globalConfig.useExpress,
    });
    try {
        const toValidate = (req: Object)[what];
        const validated = await yup.object().shape(shape).validate(toValidate, config);
        Object.assign((req: Object), {
            [what]: validated,
            [`orig${what}`]: toValidate,
        });
        next();
    } catch (validationErrors) {
        errors.sendValidationErrors(validationErrors, config, res);
    }
};

/**
 * Define the validation rules for the query params.
 * @param queryShape object, that describes the expected fields of the query string
 * @param options configuration for this validation middleware (e.g. abortEarly:true)
 */
const query = (queryShape: YupShape = {},
               options?: Config = configuration.readGlobalConfig()) => (req: (express$Request | RestifyRequest),
                                                                        res: (express$Response | RestifyResponse),
                                                                        next: (express$NextFunction | RestifyNextFunction)): void => {
    validate(queryShape, 'query', options, req, res, next);
};

/**
 * Define the validation rules for the request body.
 * @param bodyShape object, that describes the expected fields of the request
 * @param options configuration for this validation middleware (e.g. abortEarly:true)
 */
const body = (bodyShape: YupShape = {},
              options?: Config = configuration.readGlobalConfig()) => (req: (express$Request | RestifyRequest),
                                                                       res: (express$Response | RestifyResponse),
                                                                       next: (express$NextFunction | RestifyNextFunction)): void => {
    validate(bodyShape, 'body', options, req, res, next);
};

module.exports = {
    query,
    body,
};
