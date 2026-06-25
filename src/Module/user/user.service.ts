
import config from "../../config/index.js"
import { prisma } from "../../lib/prisma.js"
import { IUser } from "./user.interface.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
 

const userRegisterIntoDB = async(payload : IUser) => {
    try {
       const {name, email, password,profilePhote,bio } = payload
       const isUserExist = await prisma.user.findUnique({
        where :{
          email
        }
       })

       if (isUserExist) {
         throw new Error("User all ready exists!")
       }

       const hashPassword =  await bcrypt.hash(password,Number(config.bcrypt_salt_rounds))
       
       const createdUser = await prisma.user.create({
          data : {
             name,  
             email, 
             password : hashPassword,
          }
       })
       
       await prisma.profile.create({
          data : {
             userId : createdUser.id,
             profilePhote,
             bio
          }
       })
       
        const user = await prisma.user.findUnique({
          where : {
            id : createdUser.id,
            email : createdUser.email || email
          },
          omit :{
              password : true
          },
          include : {
            profile : true
          }
        })


       return user

    } catch (error : any) {
       throw  error(error)
    }
}


 export const userService = {
  userRegisterIntoDB,
}