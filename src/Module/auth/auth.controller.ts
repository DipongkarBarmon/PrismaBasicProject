import { NextFunction, Request, RequestHandler, Response } from "express";
 
import httpStatus  from "http-status";
import { catchAsync } from "../../Utility/catchAsync.js";
import sendRespons from "../../Utility/sendRespons.js";
import { authService } from "./auth.service.js";



 

const userLogin = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{
      const {accessToken, refreshToken} = await authService.userLoginFromBD(req.body);
       res.cookie("accessToken",accessToken,{
          secure : false,
          httpOnly : true,
          sameSite : "lax",
          maxAge : 1000*60*60*24  // 1d

      })
      res.cookie("refreshToken",refreshToken,{
          secure : false,
          httpOnly : true,
          sameSite : "lax",
          maxAge : 1000*60*60*24  // 1d

      })

       sendRespons(res, {
          success : true,
          statusCode : httpStatus.OK, 
          message : "User login successfully!",
          data : {
            accessToken,
            refreshToken
         }
      })
   
})

const refreshToken = catchAsync(async( req : Request,res: Response,next : NextFunction) => {
      const token = req.cookies.RefreshToken;

      const accessToken = await authService.refreshTokenFromDB(token)
      
      res.cookie("accessToken",accessToken, {
         secure : false,
         httpOnly : true,
         sameSite :"lax",
         maxAge : 1000*60*60*24
      })
      
      sendRespons(res, {
          success : true,
          statusCode : httpStatus.OK,
          message : "Token refreshed successfully",
          data : {
             accessToken
          }
      })
})

export const authController ={
   userLogin,
   refreshToken
}