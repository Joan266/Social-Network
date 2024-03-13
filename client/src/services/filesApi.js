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
  static async profilePic(username, headers) {
      try {
          const auth = createCustomAxios(headers)

          // Make a request to get Blob image data
          const profilePicResponse = await auth.get("/files/profilepicdata", {
              params: {emailOrUsername:username},
              responseType: 'blob'
          });
  
          // Return Blob image data
          return profilePicResponse.data;

      } catch (error) {
          console.log("Error showing image:", error);
          throw error; // Re-throw the error to be caught by the caller
      }
  }  
  static async postImage(postId, headers) {
    try {
        const auth = createCustomAxios(headers);

        // Make parallel requests to get Blob image data and Json data
        const [postImageBlobResponse, postImageJsonResponse] = await Promise.all([
            auth.get("/files/postimagedata", {
                params: { postId },
                responseType: 'blob'
            }),
            auth.get("/files/postimagemetadata", {
                params: { postId },
            })
        ]);

        // Return both Blob image data and Json data
        return {
            postImageData: postImageBlobResponse.data,
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
