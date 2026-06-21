import { Request, Response } from "express";
import { userService } from "./user.service.js";
import httpStatus  from "http-status";


const userRegister = async(req : Request, res : Response) => {

   try {
      const user = await userService.userRegisterIntoDB(req.body)
    
      res.status(httpStatus.CREATED).json({
         success : true,
         message : "User register successfully!",
         data : user
      })

   } catch (error) {
    
   }
   
}


export const userController ={
   userRegister
}