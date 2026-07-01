
import { Router } from "express";
import { authController } from "./auth.controller.js";
 

const router = Router()

router.post('/login',authController.userLogin)
router.post('/refresh-token',authController.refreshToken)

export const authRouter = router 
