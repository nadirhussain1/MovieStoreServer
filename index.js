import express from "express";
import morgan from 'morgan';
import { router as movieRouter } from './movie/index.js';
import { router as loginRouter } from './auth.js';
import { expressjwt as expressJwt } from 'express-jwt';
import graphql from './graphql.js';

const app = express();

app.use(morgan('common', { immediate: true }));

app.use(express.json());

app.use('/login', loginRouter);

app.use( '/movie', expressJwt({ secret: 'secret', algorithms: ['HS256'] }), movieRouter,);

app.use((err, request, response, next) => {

    if (err.name === 'UnauthorizedError') {
        response.status(401).json('unauthorized');
    } else {
        next();
    }

});

app.get('/', (request, response) => response.redirect('/movie'));

app.use( '/graphql', expressJwt({ secret: 'secret', algorithms: ['HS256'] }), graphql);


app.listen(8080, () => {
    console.log('Server is listening at http://localhost:8080');
})

