import { NextFunction, raw, Request, Response } from "express";
import { catchAsync } from "../../Utility/catchAsync.js";
import { postService } from "./post.service.js";
import sendRespons from "../../Utility/sendRespons.js";
import htttpsStatus from "http-status"
 
const createPost = catchAsync(async(req : Request, res : Response, next : NextFunction) => {
     const createPost = await postService.createPostIntoDB(req.user.id, req.body)

     sendRespons(res, {
       success : true,
       statusCode : htttpsStatus.OK,
       message : "Post create successfully!",
       data : createPost
     })

})


const getAllPost = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
     const posts = await postService.getAllPostFromDB();

     sendRespons(res, {
       success : true,
       statusCode : htttpsStatus.OK,
       message : "All post retrive successfully!",
       data : {
         posts
       }
     })
})
 
const getPostByStats = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
      const result = await postService.getPostStats()

      sendRespons(res, {
          success : true,
          statusCode : htttpsStatus.OK,
          message : "Post status retrive successfully!",
          data : result
      })
})

const getOwnPost = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
     const ownPost = await postService.getOwnPostFromDB(req.user.id)

     sendRespons(res, {
       success : true,
       statusCode:htttpsStatus.OK,
       message : "Retrive own post successfully!",
       data : {
         ownPost
       }
     })
})


const getPostById = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const {postId} = req.params
    console.log(postId)
    if(!postId) {
       throw new Error("Post id is not crrect!")
    }
    const post = await postService.getPostByIdFromDB(postId as string,req.user.id)

    sendRespons(res, {
       success : true,
       statusCode : htttpsStatus.OK,
       message : "Retrive post successfully!",
       data : post
    })
})

const updatePost = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
     const {postId} = req.params
     console.log(postId)
     const isAdmin = req.user.role === "ADMIN"

     const result = await postService.updataPostIntoDB(postId as string ,req.body,req.user.id,isAdmin)

     sendRespons(res, {
        success : true,
        statusCode : htttpsStatus.OK,
        message : "Post update successfully!",
        data : result
     })
})

const deletePost = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const {postId} = req.params
    const isAdmin = req.user.role === "ADMIN"
    await postService.deletePostFromDB(postId as string, req.user.id, isAdmin)

    sendRespons(res,{
      success : true,
      statusCode : htttpsStatus.OK,
      message : "Post delete successfully!"
    })
})

export const postController = {
  createPost,
  getAllPost,
  getPostByStats,
  getOwnPost,
  getPostById,
  updatePost,
  deletePost
}