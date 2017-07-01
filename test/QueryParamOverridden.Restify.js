//@flow
/**
 * @author dskgry
 */

const superTest = require('supertest');
const validate = require('../src/index');
const server = require('./RestifyServer');


describe('Validate query params with restify and overridden config', () => {
    beforeAll(() => {
        server.get('/',
            validate.query(
                {
                    a: validate.yup.number().required('set me'),
                    b: validate.yup.string().min(3, 'too short').default('bbb'),
                    c: validate.yup.boolean().required(),
                    d: validate.yup.array().required(),
                    e: validate.yup.array().of(validate.yup.number())
                },
                {stripUnknown: false, abortEarly: true}
            ),
            (req: RestifyRequest, res: RestifyResponse) => {
                res.send(req.query);
            }
        );
        validate.configure({useExpress: false});
    });

    it('validates correctly when query params are valid', async done => {
        const validResponse = await superTest(server).get('/?a=1&c=true&d=1&d=abc&e=1&e=2&IWILLBEGONE=false');
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
            IWILLBEGONE: 'false'
        });
        done();
    });

    it('validates correctly when query params are not valid', async done => {
        const invalidRequestNoParams = await superTest(server).get('/?IWILLBEGONE=true');
        expect(invalidRequestNoParams.status).toBe(400);
        expect(Object.keys(invalidRequestNoParams.body).length).toBe(1); //result is random
        done();
    });

});

