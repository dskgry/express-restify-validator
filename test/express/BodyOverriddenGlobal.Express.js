//@flow
/**
 * @author dskgry
 */

const superTest = require('supertest');
const validate = require('../../src/index');
const server = require('./ExpressServer');

describe('Validate body with express and overridden config', () => {
    beforeAll(() => {
        validate.configure({
            abortEarly: true,
            stripUnknown: false,
        });
        server.post('/',
            validate.body(
                {
                    a: validate.yup.number().required('set me'),
                    b: validate.yup.string().min(3, 'too short').default('bbb'),
                    c: validate.yup.boolean().required(),
                    d: validate.yup.array().required(),
                    e: validate.yup.array().of(validate.yup.number()),
                }
            ),
            (req: express$Request, res: express$Response) => {
                res.send(req.body);
            }
        );
    });

    it('validates correctly when body is valid', async done => {
        const validResponse = await superTest(server).post('/').send({
            a: 1,
            c: true,
            d: [
                1,
                'abc',
            ],
            e: [
                1,
                2,
            ],
            IWILLBEGONE: false,
        });
        expect(validResponse.status).toBe(200);
        expect(validResponse.body).toEqual({
            a: 1,
            b: 'bbb',
            c: true,
            d: [
                1,
                'abc',
            ],
            e: [
                1,
                2,
            ],
            IWILLBEGONE: false,
        });
        done();
    });

    it('validates correctly when query params are not valid', async done => {
        const invalidRequestNoParams = await superTest(server).post('/').send({
            IWILLBEGONE: true,
        });
        expect(invalidRequestNoParams.status).toBe(400);
        expect(Object.keys(invalidRequestNoParams.body).length).toBe(1); //result is random
        done();
    });
});
