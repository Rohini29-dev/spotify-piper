import cookieParser from 'cookie-parser'
import express from 'express'
import morgan from 'morgan'
import musicRoutes from './routes/music.routes.js'
import cors from 'cors'


const app = express()

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api/music',musicRoutes)


export default app