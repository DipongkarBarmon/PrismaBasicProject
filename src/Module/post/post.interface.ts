import { PostStatus } from "../../../generated/prisma/enums.js";

 
export interface IPost {
   title :string,
   content :string,
   thumbnail? : string,
   isFeatured? :boolean,
   status? : PostStatus,
   tags  : string[]
}

export interface IUpdatePost {
   title? :string,
   content? :string,
   thumbnail? : string,
   isFeatured? :boolean,
   status? : PostStatus,
   tags?  : string[]
}