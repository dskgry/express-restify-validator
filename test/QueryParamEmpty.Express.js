//@flow
/**
 * @author dskgry
 */

const superTest = require('supertest');
const server = require('./ExpressServer');
const validate = require('../src/index');

describe('Empty configuration', () => {
    it('validates to empty object with not validation rules', async done => {
        server.get('/',
            validate.query(),
            (req: express$Request, res: express$Response) => {
                res.send(req.query);
            }
        );
        const validResponse = await superTest(server).get('/?a=1&c=true&d=1&d=abc&e=1&e=2&IWILLBEGONE=true');
        expect(validResponse.status).toBe(200);
        expect(validResponse.body).toEqual({});
        done();
    });

    it('validates nothing with no validation rules and stripUnknown false', async done => {
        server.get('/test/',
            validate.query({a: validate.yup.string()}, {stripUnknown: false}),
            (req: express$Request, res: express$Response) => {
                res.send(req.query);
            }
        );
        const validResponse = await superTest(server).get('/test/?a=1&c=true&d=1&d=abc&e=1&e=2&IWILLBEGONE=false');
        expect(validResponse.status).toBe(200);
        expect(validResponse.body).toEqual({
            IWILLBEGONE: 'false',
            a: '1',
            c: 'true',
            d: ['1', 'abc'],
            e: ['1', '2']
        });
        done();
    });
});