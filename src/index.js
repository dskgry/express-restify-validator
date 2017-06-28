//@flow
/**
 * @author dskgry
 */

const yup = require('yup');


const GLOBAL_CONFIG: Config = {
    stripUnknown: true,
    abortEarly: false
};


const collectErrors = (e: ValidationErrorType, config: Config): Object => {
    if (config.abortEarly) {
        return {
            [e.path]: e.errors,
        };
    }
    return e.inner.reduce((errors, currentValidation) => {
        errors[currentValidation.path] = currentValidation.errors;
        return errors;
    }, {});
};

const queryParams = (shape: YupShape, options: ?Config) => async (req: express$Request, res: express$Response, next: express$NextFunction): Promise<void> => {
    const config = Object.assign({}, GLOBAL_CONFIG, options);
    try {
        const queryParams = req.query;
        const validated = await yup.object().shape(shape).validate(queryParams, config);

        Object.assign((req: any), {
            query: validated,
            origQuery: req.query
        });

        next();
    } catch (e) {
        res.status(400).json(collectErrors(e, config));
    }
};


module.exports = {
    queryParams,
    yup,
};
