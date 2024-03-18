import { createCustomAxios } from './apiConfig'
import { blobToBase64 } from '../utils/useBlobToBase64'

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

        // Convert blob to Base64
        const postImageBase64 = await blobToBase64(postImageBlobResponse.data);

        // Return both Blob image data and Json data
        return {
            postImageBase64,
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
