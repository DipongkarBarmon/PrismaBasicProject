import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service.js";
import httpStatus  from "http-status";
import { catchAsync } from "../../Utility/catchAsync.js";
import sendRespons from "../../Utility/sendRespons.js";
 



const userRegister =catchAsync(async(req : Request, res : Response , next : NextFunction) => {
 
      const user = await userService.userRegisterIntoDB(req.body)
    
      sendRespons(res, {
          success : true,
          statusCode : httpStatus.CREATED,
          message : "User register successfully!",
          data : {
            user
         }
      })
   
})

const getUserProfile = catchAsync(async(req : Request, res: Response, next : NextFunction) => {
     const profile = await userService.getUserProfileFromDB(req.user.id)
      sendRespons(res, {
          success : true,
          statusCode : httpStatus.OK,
          message : "User profile retrive successfully!",
          data : {
            profile
         }
      })
})
 

const updateUserProfile = catchAsync(async(req : Request, res : Response, next : NextFunction) => {
       const updateUser = await userService.updateUserProfileIntoDB(req.user.id,req.body)
       sendRespons(res, {
         success : true,
         statusCode : httpStatus.OK,
         message : "User profile updated  successfully!",
         data : {
            updateUser
         }
       })
})

export const userController ={
   userRegister,
   getUserProfile,
   updateUserProfile
}