import cookieParser from "cookie-parser"
import express from 'express'
import morgan from 'morgan'
import passport from 'passport'
import authRouter from '../src/routes/auth.routes.js'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import _config from "../src/config/config.js"
import cors from 'cors'



const app = express()

app.use(morgan('dev'))
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))
app.use(express.json()),
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: _config.CLIENT_ID,
  clientSecret: _config.CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
}));


app.use('/api/auth',authRouter)


export default app