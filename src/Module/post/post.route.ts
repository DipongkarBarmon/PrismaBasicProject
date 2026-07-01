
import { Router } from "express";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { postController } from "./post.controller.js";

const router  = Router()

router.post('/',auth(Role.USER, Role.USER),postController.createPost)
router.get('/',postController.getAllPost)
 
router.get('/stats',auth(Role.ADMIN),postController.getPostByStats)
router.get('/my-posts',auth(Role.ADMIN,Role.USER),postController.getOwnPost)
router.get('/:postId',auth(Role.ADMIN,Role.USER),postController.getPostById)
router.patch('/:postId',auth(Role.ADMIN,Role.USER),postController.updatePost)
router.delete('/:postId',auth(Role.ADMIN,Role.USER),postController.deletePost)


export const postRouter = router