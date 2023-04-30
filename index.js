import express from "express";
import morgan from 'morgan';
import {router as movieRouter} from './movie/index.js';


const app = express();

app.use(morgan('common', { immediate: true}));

app.use(express.json());

app.use('/movie', movieRouter);

app.get('/',(req,res) => res.redirect('/movie'));

app.listen(8080,() => {
    console.log('Server is listening at http://localhost:8080');
})

