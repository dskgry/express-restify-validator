//@flow
/**
 * @author dskgry
 */

const superTest = require('supertest');
const validate = require('../../src/index');
const server = require('./RestifyServer');

describe('Empty configuration', () => {
    beforeAll(() => {
        validate.configure({
            useExpress: false,
        });
    });

    it('validates to empty object with not validation rules', async done => {
        server.get('/',
            validate.query(),
            (req: RestifyRequest, res: RestifyResponse) => {
                res.send(req.query);
            },
        );
        const validResponse = await superTest(server).get('/?a=1&c=true&d=1&d=abc&e=1&e=2&IWILLBEGONE=true');
        expect(validResponse.status).toBe(200);
        expect(validResponse.body).toEqual({});
        done();
    });

    it('validates nothing with no validation rules and stripUnknown false', async done => {
        server.get('/test/',
            validate.query(
                {},
                {
                    stripUnknown: false,
                }
            ),
            (req: RestifyRequest, res: RestifyResponse) => {
                res.send(req.query);
            }
        );
        const validResponse = await superTest(server).get('/test/?a=1&c=true&d=1&d=abc&e=1&e=2&IWILLBEGONE=false');
        expect(validResponse.status).toBe(200);
        expect(validResponse.body).toEqual({
            IWILLBEGONE: 'false',
            a: '1',
            c: 'true',
            d: [
                '1',
                'abc',
            ],
            e: [
                '1',
                '2',
            ],
        });
        done();
    });
});
