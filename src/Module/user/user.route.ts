
import { Router } from "express";
import { userController } from "./user.controller.js";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";


const router = Router()

router.post('/register',userController.userRegister)
router.get('/me',auth(Role.USER,Role.ADMIN,Role.AUTHOR),userController.getUserProfile)

router.put('/my-profile',auth(Role.ADMIN,Role.USER,Role.AUTHOR),userController.updateUserProfile)

export const userRouter = router