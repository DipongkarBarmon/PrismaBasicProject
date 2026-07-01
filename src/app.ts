import express, { Application, Request, Response } from "express"
import cors from "cors"
import config from "./config/index.js"
import cookieParser from "cookie-parser"
import { prisma } from "./lib/prisma.js"
import { userRouter } from "./Module/user/user.route.js"
import { authRouter } from "./Module/auth/auth.route.js"
import { postRouter } from "./Module/post/post.route.js"

const app: Application = express()
 

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.text())
app.use(cors({
      origin: config.app_url,
    }))

app.use(cookieParser())

app.get('/',async(req : Request, res : Response) => {
    res.send("Hello, World!")
})

app.use('/api/users',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/posts',postRouter)

export default app;