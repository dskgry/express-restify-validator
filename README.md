# express-restify-validator
Declarative validation middleware that can be used with express and/or resitfy.

Tries to be as declarative as possible by using yup (https://github.com/jquense/yup). yup is awesome.

Highly work in progress atm.

## Install

Not released yet.

## Usage will be

```js
 
 const server = express();
 server.get('/',
    validate.query({
        a: validate.yup.number().required('set me'),
        b: validate.yup.string().min(3, 'too short').default('bbb'),
        c: validate.yup.boolean().required(),
        d: validate.yup.email().required(),
        e: validate.yup.array().of(validate.yup.number())
     }),
     (req, res) => {
        res.send(req.query);
     }
);
```

