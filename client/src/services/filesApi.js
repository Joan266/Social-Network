import { createCustomAxios } from './apiConfig'

export class filesApi {
  static async upload(formData,headers) {
      try {
          const auth = createCustomAxios(headers)
          const response = await auth.post("/files/upload", formData);
          return response.data; 
      } catch ({response}) {
          console.log("Error uploading file:", response.error);
      }
  }
  static async profilePic(userId, headers) {
      try {
          const auth = createCustomAxios(headers)

          // Make a request to get Blob image data
          const profilePicResponse = await auth.get("/files/profile_pic_data", {
              params: { userId },
              responseType: 'blob'
          });
  
          // Return Blob image data
          return profilePicResponse;

      } catch (error) {
          console.log("Error showing image:", error);
          throw error; // Re-throw the error to be caught by the caller
      }
  }  
  static async postImage(postId, headers) {
    try {
        const auth = createCustomAxios(headers)

        // Make a request to get Blob image data
        const postImageBlobResponse = await auth.get("/files/post_image_data", {
            params: { postId },
            responseType: 'blob'
        });

        // Make a request to get Json data
        const postImageJsonResponse = await auth.get("/files/post_image_metadata", {
            params: { postId },
        });

        // Return Blob image data
        return {
            postImageData: postImageBlobResponse,
            postImageMetadata: postImageJsonResponse.data,
        };
        
    } catch (error) {
        console.log("Error showing image:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}    
  static async delete({fileId,userToken}) {
      try {
          const auth = createCustomAxios({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          })
          await auth.delete("/files/delete", {
              params: { fileId }
          });
      } catch ({response}) {
          console.log("Error deleting file:", response.error);
      }
  }
}
