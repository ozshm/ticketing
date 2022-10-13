import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@osticketing/common';

import { Password } from '../services/password';
import { User } from '../models/user';

const router = express.Router();

router.post(
'/api/users/signin',
[
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
],
validateRequest,
async (req: Request, res: Response) =>{
    const { email, password } = req.body;

    // Check wether a user with the email provided is exist
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    
    // Compare the passwords of the stored user and the supplied password
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Login succeeded

    // Generate JWT
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!);

    // Store it on session object
    req.session = {
      jwt: userJwt
    }

    res.status(200).send(existingUser);
     

});

export {router as signinRouter};