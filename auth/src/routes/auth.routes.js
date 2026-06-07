import express from 'express'   
import  * as validationRule from '../middlewares/auth.middleware.js'
import * as authController from '../controllers/auth.controller.js'
import passport from 'passport';

const router =  express.Router()


router.post('/register',validationRule.registerUserValidationRules , authController.register)
console.log('auth.routes loaded');

router.post('/login',validationRule.loginUserValidationRules,authController.login)

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),authController.googleAuthCallback);

export default router