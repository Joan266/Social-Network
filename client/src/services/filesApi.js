import { http, createCustomAxios } from './apiConfig'

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
  static async image(fileId, headers) {
      try {
          const auth = createCustomAxios(headers)
          
          // Make a request to get JSON metadata
          const imgMetadataResponse = await auth.get("/files/img_metadata", {
              params: { fileId },
          });
  
          // Make a request to get Blob image data
          const imgDataResponse = await auth.get("/files/img_data", {
              params: { fileId },
              responseType: 'blob'
          });
  
          // Return both JSON metadata and Blob image data
          return {
              imgMetadata: imgMetadataResponse.data,
              imgData: imgDataResponse.data
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
