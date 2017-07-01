//@flow
/**
 * @author dskgry
 */

jest.mock('yup');
const yup = require('yup');

describe('Global configuration', () => {
    beforeEach(() => {
        jest.resetModules();
    });
    it('Can be configured globally only once', async () => {
        const validate = require('../src/index');
        validate.configure();
        expect(() => validate.configure()).toThrowError();
    });

    it('Has the expected global default configuration', async () => {
        const validate = require('../src/index');
        validate.configure();
        expect(validate.readConfig()).toEqual({
            abortEarly: false,
            stripUnknown: true,
            useExpress: true,
        });
    });

    it('Has the expected global default configuration after global config is overridden', async () => {
        const validate = require('../src/index');
        validate.configure({
            abortEarly: true,
            stripUnknown: false,
            useExpress: false,
        });
        expect(validate.readConfig()).toEqual({
            abortEarly: true,
            stripUnknown: false,
            useExpress: false,
        });
    });

});
