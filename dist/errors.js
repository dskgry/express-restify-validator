//     
/**
 * @author dskgry
 */

/**
 * Maps the YUP validation errors to a POJO
 *
 * @param e the YUP validation error
 * @param config Configuration to check if abortEarly is true. If so, no inner errors will be set by yup
 * @returns An POJO with the paths as keys and the error messages as value (e.g. {myAttribute:['required','too short']})
 */
const collectErrors = (e                     , config        )         => {
    if (config.abortEarly) {
        return {
            [e.path]: e.errors,
        };
    }
    return e.inner.reduce((errors, currentValidation) => Object.assign(errors, {
        [currentValidation.path]: currentValidation.errors,
    }), {});
};

/**
 *
 * @param e the YUP validation error
 * @param config the global config to be used (check server type and abortEarly)
 * @param res express- or restify response instance
 */
const sendValidationErrors = (e                     ,
                              config        ,
                              res                                      ) => {
    if (config.useExpress) {
        const expressResponse                   = (res     );
        expressResponse.status(400).json(collectErrors(e, config));
    } else {
        const restifyResponse                  = (res     );
        restifyResponse.json(400, collectErrors(e, config));
    }
};

module.exports = {
    sendValidationErrors,
};
