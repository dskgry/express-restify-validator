//@flow
/**
 * @author dskgry
 */

const superTest = require('supertest');
const validate = require('../../src/index');
const server = require('./ExpressServer');

describe('Empty configuration', () => {
    it('validates to empty object with not validation rules', async done => {
        server.post('/',
            validate.body(),
            (req: express$Request, res: express$Response) => {
                res.send(req.body);
            }
        );
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
            IWILLBEGONE: true,
        });
        expect(validResponse.status).toBe(200);
        expect(validResponse.body).toEqual({});
        done();
    });

    it('validates nothing with no validation rules and stripUnknown false', async done => {
        server.post('/test/',
            validate.body(
                {},
                {
                    stripUnknown: false,
                }
            ),
            (req: express$Request, res: express$Response) => {
                res.send(req.body);
            }
        );
        const validResponse = await superTest(server).post('/test').send({
            a: '1',
            c: true,
            d: [
                1,
                'abc',
            ],
            e: [
                1,
                2,
            ],
            IWILLBEGONE: 'false',
        });
        expect(validResponse.status).toBe(200);
        expect(validResponse.body).toEqual({
            IWILLBEGONE: 'false',
            a: '1',
            c: true,
            d: [
                1,
                'abc',
            ],
            e: [
                1,
                2,
            ],
        });
        done();
    });
});
