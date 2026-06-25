
import config from "../../config/index.js"
import { prisma } from "../../lib/prisma.js"
import { IUser } from "./user.interface.js"
import bcrypt from "bcryptjs"
 
 

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

const getUserProfileFromDB = async(userId : string) => {
     
   try {
      const user = await prisma.user.findUniqueOrThrow ({
       where : {
          id : userId
       },
       omit :{
          password :true
       },
       include :{
         profile : true
       }
    })

    return user.profile
   } catch (error : any) {
      throw error(error);
   }

    
}
const updateUserProfileIntoDB = async(userID : string, payload : IUser) => {
    
   const {name, email, profilePhote, bio} = payload

   const updateUser = await prisma.user.update({
      where : {
         id : userID
      },
      data :{
         name,
         email,
         profile : {
            update : {
               profilePhote,
               bio
            }
         }
      },
      omit : {
         password : true,
      },
      include : {
         profile : true
      }
   })

   return updateUser;

}

 export const userService = {
  userRegisterIntoDB,
  getUserProfileFromDB,
  updateUserProfileIntoDB
}