//@flow
/**
 * @author dskgry
 */

const superTest = require('supertest');
const validate = require('../../src/index');
const server = require('./RestifyServer');

describe('Validate request body with restify and default config', () => {
    beforeAll(() => {
        validate.configure({
            useExpress: false,
        });
        server.post('/',
            validate.body({
                a: validate.yup.number().required('set me'),
                b: validate.yup.string().min(3, 'too short').default('bbb'),
                c: validate.yup.boolean().required(),
                d: validate.yup.array().required(),
                e: validate.yup.array().of(validate.yup.number()),
            }),
            (req: RestifyRequest, res: RestifyResponse) => {
                res.send(req.body);
            }
        );
    });

    it('validates correctly when query params are valid', async done => {
        const validResponse = await superTest(server).post('/').send({
            a: 1,
            c: true,
            d: [
                '1',
                'abc',
            ],
            e: [
                1,
                2,
            ],
            IWILLBEGONE: true,
        });
        expect(validResponse.status).toBe(200);
        expect(validResponse.body).toEqual({
            a: 1,
            b: 'bbb',
            c: true,
            d: [
                '1',
                'abc',
            ],
            e: [
                1,
                2,
            ],
        });
        done();
    });

    it('validates correctly when body params are not valid', async done => {
        const invalidRequestNoParams = await superTest(server).post('/').send({
            IWILLBEGONE: true,
        });
        expect(invalidRequestNoParams.status).toBe(400);
        expect(invalidRequestNoParams.body).toEqual({
            a: [
                'set me',
            ],
            c: [
                'c is a required field',
            ],
            d: [
                'd is a required field',
            ],
        });

        const invalidRequestBTooShortCNotABoolAndDNotArray = await superTest(server).post('/').send({
            a: 1,
            b: 'a',
            c: 'test',
            d: null,
            IWILLBEGONE: true,
        });
        expect(invalidRequestBTooShortCNotABoolAndDNotArray.status).toBe(400);
        expect(invalidRequestBTooShortCNotABoolAndDNotArray.body).toEqual({
            b: [
                'too short',
            ],
            c: ['c must be a `boolean` type, got: \"test\" instead'], //eslint-disable-line
            d: ['d must be a `array` type, got: \"\" instead'] //eslint-disable-line
        });
        done();

        const invalidResponseENotArrayOfNumbers = await superTest(server).post('/').send({
            a: 1,
            c: true,
            d: [
                1,
                2,
            ],
            e: [
                1,
                'rrr',
            ],
            IWILLBEGONE: true,
        });
        expect(invalidResponseENotArrayOfNumbers.status).toBe(400);
        expect(invalidResponseENotArrayOfNumbers.body).toEqual({
            'e[1]': ['e[1] must be a `number` type, got: \"\" instead'] //eslint-disable-line
        });
        done();
    });
});
