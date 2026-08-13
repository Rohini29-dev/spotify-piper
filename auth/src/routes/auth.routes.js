import express from 'express'   
import  * as validationRule from '../middlewares/auth.vailidation.js'
import * as authController from '../controllers/auth.controller.js'
import passport from 'passport';
import authMiddleware from "../middlewares/auth.middleware.js";



const router =  express.Router()


router.post('/register',validationRule.registerUserValidationRules , authController.register)

router.post('/login',validationRule.loginUserValidationRules,authController.login)

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),authController.googleAuthCallback);

  router.post("/logout", authController.logOutUser);

  router.get("/me", authMiddleware, authController.getCurrentUser);

export default router