import path from "path";
import cookieParser from 'cookie-parser'
import express from 'express'
import morgan from 'morgan'
import musicRoutes from './routes/music.routes.js'
import cors from 'cors'

const app = express()



app.use(express.json())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api/music',musicRoutes)

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);


export default app