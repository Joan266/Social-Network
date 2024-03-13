import { http, createCustomAxios } from './apiConfig'
import axios from 'axios'
export class userApi {
   
  static async signup(data) {
      try {
          const response = await http.post("/user/signup", data);
          return response.data; 
      } catch ({response}) {
          console.log("Error signing up:", response.data);
          return response.data;
      }
  }
  static async login({ emailOrUsername, password }) {
    try {
        // Fetch login response data
        const { data: loginResponseData } = await http.get("/user/login", {
            params: { emailOrUsername, password }
        });

        // Check for error in login response
        if (loginResponseData.error) {
            return loginResponseData;
        }

        // Check if profile picture is available
        if (loginResponseData.profilePicFileId) {
            // Fetch profile picture data
            const auth = createCustomAxios({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginResponseData.token}`,
            });

            const { data: profilePicData } = await auth.get("/files/profilepicdata", {
                params: { emailOrUsername },
                responseType: 'blob'
            });

            return { profilePicData, loginResponseData };
        }

        return { loginResponseData };

    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}
static async fetchUserProfilePic({ username, userToken }) {
    try {
        const auth = createCustomAxios({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        });

        const { data: profilePicData } = await auth.get("/files/profilepicdata", {
            params: { emailOrUsername: username },
            responseType: 'blob'
        });

        return profilePicData;
    
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}

static async searchUser(data, headers) {
    try {
        const auth = createCustomAxios(headers);

        // Set the cancel token in the request configuration
        const response = await auth.post("/user/search", data);
        return response.data;
    } catch (error) {
        console.log("Error searching user:", error);
    }
}
  static async fetchUserData(query, headers) {
      try {
          const auth = createCustomAxios(headers)

          const response = await auth.get("/user/fetchdata", {
              params: { query },
          });
          return response.data;
      } catch ({response}) {
          console.log("Error user not found:", response.data);
          return response.data;
      }
  }
  static async fetchUserPosts(data, headers) {
      try {
          const auth = createCustomAxios(headers)

          const response = await auth.get("/user/fetchposts", {
              params: data,
          });
          return response.data;
      } catch ({response}) {
          console.log("Error user posts not found:", response.data);
          return response.data;
      }
  }
  static async followUser(data, headers) {
      try {
          const auth = createCustomAxios(headers)

          const response = await auth.put("/user/follow", data);
          return response.data;
      } catch ({response}) {
          console.log("Error following user:", response.data);
          return response.data;
      }
  }
  static async unfollowUser(data, headers) {
      try {
          const auth = createCustomAxios(headers)

          const response = await auth.put("/user/unfollow", data);
          return response.data;
      } catch ({response}) {
          console.log("Error unfollowing user:", response.data);
          return response.data;
      }
  }
  static async updateProfileData(data, headers) {
      try {
          const auth = createCustomAxios(headers)

          const response = await auth.put("/user/updateprofiledata", data);
          return response.data;
      } catch ({response}) {
          console.log("Error updating profile data:", response.data);
          return response.data;
      }
  }
  static async isFollowingUser(data, headers) {
      try {
          const auth = createCustomAxios(headers)
          const response = await auth.post("/user/isfollowinguser", data);
          return response.data;
      } catch ({response}) {
          console.log("Error checking if user profile is being followed by user:", response.data);
          return response.data;
      }
  }
}