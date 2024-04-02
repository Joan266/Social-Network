import { createCustomAxios } from './apiConfig'

export class postApi {
    
  static async fetchPostData(postId, headers) {
      try {
          const auth = createCustomAxios(headers)

          const postResponseData = await auth.get("/post/fetchpostdata", {
              params: { postId },
          });

          return postResponseData.data;
      } catch ({response}) {
          console.log("Error post not found:", response);
          return response;
      }
  }
  static async create(data, headers) {
      try {
          const auth = createCustomAxios(headers)
          const response = await auth.post("/post/create", data);
          return response.data; 
      } catch ({response}) {
          console.log("Error creating post:", response.error);
      }
  }
  static async delete(data, headers) {
    try {
        const auth = createCustomAxios(headers)
        const deletePostResponse = await auth.post("/post/delete", data); 
        console.log(deletePostResponse)
        if(deletePostResponse.ok && deletePostResponse.postImageFileId){ 
            const deleteImagePostResponse = await auth.post("/file/delete", {fileId:deletePostResponse.postImageFileId}); 
        }
        return deletePostResponse
    } catch ({response}) {
        console.log("Error deleting post:", response.error);
    }
}
  static async likePost(data, headers) {
      try {
          const auth = createCustomAxios(headers)

          const response = await auth.put("/post/like", data);
          return response.data;
      } catch ({response}) {
          console.log("Error liking post:", response.data);
          return response.data;
      }
  }
  static async unlikePost(data, headers) {
      try {
          const auth = createCustomAxios(headers)

          const response = await auth.put("/post/unlike", data);
          return response.data;
      } catch ({response}) {
          console.log("Error unliking post:", response.data);
          return response.data;
      }
  }
  static async isLiking(data, headers) {
      try {
          const auth = createCustomAxios(headers)
          const response = await auth.post("/post/isliking", data);
          return response.data;
      } catch ({response}) {
          console.log("Error checking if post is being liked by user:", response.data);
          return response.data;
      }
  }
  static async fetchHomePosts(data, headers) {
      try {
          const auth = createCustomAxios(headers)

          const response = await auth.get("/post/homeposts",{
              params: data,
          });
          return response.data;
      } catch ({response}) {
          console.log("Error posts not found:", response.data);
          return response.data;
      }
  }
  static async fetchPostReplies(postId,headers) {
      try {
          const auth = createCustomAxios(headers)

          const response = await auth.get("/post/replies",{
              params: { postId },
          });
          return response.data;
      } catch ({response}) {
          console.log("Error post replies not found:", response.data);
          return response.data;
      }
  }
}