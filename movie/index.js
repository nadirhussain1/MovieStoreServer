import { Router } from "express";
import {
    listAction,
    detailAction,
    createAction,
    updateAction,
    deleteAction,
} from './controller.js';

import validator from 'express-validator';


const router = Router();

router.get('/', listAction);
router.get('/:id', detailAction);

router.post('/',
    validator.checkSchema({
        title: {
            errorMessage: "Title is invalid",
            isString: true,
            isLength: {
                errorMessage: 'Title has to be between 1 and 20',
                options: {
                    min: 1,
                    max: 20,
                },

            }
        },

        year: {
            errorMessage: 'Year is invalid',
            isInt: true,
        }

    }),
    createAction);

router.put('/:id', updateAction);
router.delete('/:id', validator.param('id').isInt(), deleteAction);

export { router };