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
 

export const userController ={
   userRegister,
}