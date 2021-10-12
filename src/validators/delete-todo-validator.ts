import { check, ValidationChain } from 'express-validator';
import { AppContext } from '@typings';

const deleteTodoValidator = (appContext: AppContext): ValidationChain[] => [
  check('id', 'VALIDATION_ERRORS.INVALID_ID').notEmpty(),
];

export default deleteTodoValidator;
