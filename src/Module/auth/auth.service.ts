
import config from "../../config/index.js"
import { prisma } from "../../lib/prisma.js"

import bcrypt from "bcryptjs"
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { ILoginUser } from "./auth.interface.js"
import { jwtToken } from "../../Utility/jwtToken.js"
 
 

const userLoginFromBD = async(payload : ILoginUser) => {

   const {email, password} = payload

  //  const user = await prisma.user.findUnique({
  //     where : {
  //         email
  //     }
  //   })
    
  //   if (!user) {
  //     throw new Error("User not exists!")
  //   } 
  
    const user = await prisma.user.findUniqueOrThrow({
      where : {
         email
      }
    })

    const matchPassword = await bcrypt.compare(password, user.password)

    if(!matchPassword) {
       throw new Error("Invaild credentails!")
    }

    const jwtPayload = {
       id : user.id,
       email : user.email,
       name : user.name,
       role : user.role
    }

   //  const accessToken = jwt.sign(jwtPayload,config.jwt_accress_token, {
   //     expiresIn : config.jwt_access_expires_in 
   //  } as SignOptions)

   const accessToken = jwtToken.jwtTokenCreate(
      jwtPayload ,
      config.jwt_accress_token,
      config.jwt_access_expires_in as SignOptions
   )

   //  const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_token as string, {
   //     expiresIn : config.jwt_refresh_expires_in 
   //  } as SignOptions)

    const refreshToken = jwtToken.jwtTokenCreate(
        jwtPayload,
        config.jwt_refresh_token,
        config.jwt_refresh_expires_in as SignOptions
    )
    return {accessToken, refreshToken}

}

const refreshTokenFromDB = async(token : string) => {
     
   const varifiedToken = jwtToken.jwtTokenVarify(token,config.jwt_refresh_token)
   
   if(!varifiedToken.success) {
       throw new Error(varifiedToken.error)
   }
   const {id} = varifiedToken.data as JwtPayload
 
   const user = await prisma.user.findUniqueOrThrow({
      where : {
         id
      }
   })

     const jwtPayload = {
       id : user.id,
       email : user.email,
       name : user.name,
       role : user.role
    }

    const accessToken = jwtToken.jwtTokenCreate(jwtPayload , config.jwt_accress_token ,config.jwt_access_expires_in as SignOptions)


    return {accessToken}


}
export const authService = {
  userLoginFromBD,
  refreshTokenFromDB
}