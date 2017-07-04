//@flow
/**
 * @author dskgry
 */

const superTest = require('supertest');
const validate = require('../../src/index');
const server = require('./RestifyServer');

describe('Validate request body and query params with restify and default config', () => {
    beforeAll(() => {
        validate.configure({
            useExpress: false,
        });
        server.post('/',
            validate.body({
                a: validate.yup.number().required('set me body'),
                b: validate.yup.string().min(3, 'too short').default('bbb'),
                c: validate.yup.boolean().required(),
                d: validate.yup.array().required(),
                e: validate.yup.array().of(validate.yup.number()),
            }),
            validate.query({
                a: validate.yup.number().required('set me query'),
                b: validate.yup.string().min(3, 'too short').default('bbb'),
                c: validate.yup.boolean().required(),
                d: validate.yup.array().required(),
                e: validate.yup.array().of(validate.yup.number()),
            }),
            (req: RestifyRequest, res: RestifyResponse) => {
                res.send({
                    body: req.body,
                    query: req.query,
                });
            }
        );
    });

    it('validates correctly when query params are valid', async done => {
        const validResponse = await superTest(server).post('/?a=1&c=true&d=1&d=abc&e=1&e=2&IWILLBEGONE=true').send({
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
        expect(validResponse.body.body).toEqual({
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
        expect(validResponse.body.query).toEqual({
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

    it('validates correctly when qp is invalid', async done => {
        const invalidRequestNoParams = await superTest(server).post('/').send({
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
        expect(invalidRequestNoParams.status).toBe(400);
        expect(invalidRequestNoParams.body).toEqual({
            a: [
                'set me query',
            ],
            c: [
                'c is a required field',
            ],
            d: [
                'd is a required field',
            ],
        });
        done();
    });

    it('validates correctly when body is invalid', async done => {
        const invalidBody = await superTest(server).post('/?a=1&c=true&d=1&d=abc&e=1&e=2&IWILLBEGONE=true').send();
        expect(invalidBody.status).toBe(400);
        expect(invalidBody.body).toEqual({
            a: [
                'set me body',
            ],
            c: [
                'c is a required field',
            ],
            d: [
                'd is a required field',
            ],
        });
        done();
    });
});
