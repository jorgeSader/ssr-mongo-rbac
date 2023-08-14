import { body } from "express-validator";

export const registerValidator = [
  body('email').trim().isEmail().withMessage('Please enter a valid email.').toLowerCase(),

  body('password').trim().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }).withMessage('Please enter a strong password. It should be at least 8 character long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol.')
];

