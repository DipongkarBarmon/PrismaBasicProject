
import { IPost, IUpdatePost } from "./post.interface.js";
import { prisma } from "../../lib/prisma.js";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums.js";

const createPostIntoDB = async(userId : string, payload : IPost) => {

    
     const createPost = await prisma.post.create ({
         data : {
            ...payload,
            authoId : userId
         }
     })
      console.log("hello")

     return createPost
     
}

const getAllPostFromDB = async() => {
    const result = await prisma.post.findMany({
       include : {
           author : {
            omit : {
               password : true
            }
           },
          comments : true
       }  
    })
    
    return  result;

}

const getOwnPostFromDB = async(userId : string) => {
   const result = await prisma.post.findMany({
    where : {
      authoId :userId
    },
     
    include : {
      author : {
        omit : {
           password : true
        }
      },
      _count : {
        select : {
          comments : true
        }
      }
    },
     orderBy : {
       createdAt : "desc"
     },
    
   })



   return result;
}

const getPostByIdFromDB = async(postId : string,userId : string) => {

  const transctionResult = await prisma.$transaction( async(tx) => {
 
        await tx.user.findUniqueOrThrow({
      where : {
         id : userId
      }
    })

   await tx.post.update({
     where : {
      id : postId
     },
     data : {
       views : {
        increment :1
       }
     }
   })


  //  throw new Error("fake error")

   const post = await tx.post.findUniqueOrThrow({
     where : {
       id :postId
     },
      include : {
       author : {
         omit : {
          password : true 
         }
       },
       comments : {
         where : {
           status : CommentStatus.APPROVED
         },
         orderBy : {
           createdAt : "desc"
         }
       }
    }

   })
   return post
  })
    //  await prisma.user.findUniqueOrThrow({
    //   where : {
    //      id : userId
    //   }
    // })

  //  await prisma.post.update({
  //    where : {
  //     id : postId
  //    },
  //    data : {
  //      views : {
  //       increment :1
  //      }
  //    }
  //  })

  //  const post = await prisma.post.findUniqueOrThrow({
  //    where : {
  //      id :postId
  //    },
  //     include : {
  //      author : {
  //        omit : {
  //         password : true 
  //        }
  //      },
  //      comments : {
  //        where : {
  //          status : CommentStatus.APPROVED
  //        },
  //        orderBy : {
  //          createdAt : "desc"
  //        }
  //      }
  //   }

  //  })
   return transctionResult;

}


const updataPostIntoDB = async(postId : string, payload : IUpdatePost, userId : string, isAdmin : boolean) => {
       const post = await prisma.post.findUniqueOrThrow({
        where : {
           id : postId
          }
       })

       if(!isAdmin && post.authoId !== userId){
          throw new Error("You are not the owner of this post!")
       }
       
       const updatePost = await prisma.post.update({
         where : {
           id : postId
         },
         data : payload,
         include : {
          author : {
            omit : {
              password : true 
            }
          },
          comments : true
        }

       })

       return updatePost;
}


const deletePostFromDB = async(postId :string, userId : string, isAdmin :boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
      where : {
         id : postId
      }
    })

    if(!isAdmin && post.authoId !== userId) {
       throw new Error("You are not owner of this post!")
    }

    await prisma.post.delete({
      where : {
         id : postId
      }
    })
}

const getPostStats = async() => {

   const transactionResult = await prisma.$transaction(async(tx) => {
  //       const totalPosts = await tx.post.count()
  //       const totalPublishedPosts = await tx.post.count({
  //          where : {
  //            status : PostStatus.PUBLISHED
  //          }
  //       })

  //         const totalDraftPosts = await tx.post.count({
  //          where : {
  //            status : PostStatus.DRAFT
  //          }
  //       })

  //         const totalArchivedPosts = await tx.post.count({
  //          where : {
  //            status : PostStatus.ARCHIVED
  //          }
  //       })

  //       const totalComments = await  tx.comment.count();

  //       const totalApprovedComments = await tx.comment.count({
  //         where : {
  //            status : CommentStatus.APPROVED
  //         }
  //       })

  //        const totalRejectComments = await tx.comment.count({
  //         where : {
  //            status : CommentStatus.REJECTED
  //         }
  //       })

        
  //       const totalPostViewsAggregate = await tx.post.aggregate({
  //          _sum : {
  //            views : true
  //          }
  //       })

  //       const totalPostViews = totalPostViewsAggregate._sum.views

        

      // return {
      //   totalPosts,
      //   totalPublishedPosts,
      //   totalDraftPosts,
      //   totalArchivedPosts,
      //   totalComments,
      //   totalApprovedComments,
      //   totalRejectComments,
      //   totalPostViews
      // }
  
      
   const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectComments,
      totalPostViewsAggregate
   ] = await Promise.all([
         await tx.post.count(),
         await tx.post.count({
           where : {
             status : PostStatus.PUBLISHED
           }
        }),

           await tx.post.count({
           where : {
             status : PostStatus.DRAFT
           }
        }),

          await tx.post.count({
           where : {
             status : PostStatus.ARCHIVED
           }
        }),

        await  tx.comment.count(),

       await tx.comment.count({
          where : {
             status : CommentStatus.APPROVED
          }
        }),

       await tx.comment.count({
          where : {
             status : CommentStatus.REJECTED
          }
        }),

        
       await tx.post.aggregate({
           _sum : {
             views : true
           }
        }),

      ])


      return {
        totalPosts,
        totalPublishedPosts,
        totalDraftPosts,
        totalArchivedPosts,
        totalComments,
        totalApprovedComments,
        totalRejectComments,
        totalPostViews : totalPostViewsAggregate._sum.views
      }

    })

   return transactionResult
}
export const postService = {
  createPostIntoDB,
  getAllPostFromDB,
  getOwnPostFromDB,
  getPostByIdFromDB,
  updataPostIntoDB,
  deletePostFromDB,
  getPostStats
  
}