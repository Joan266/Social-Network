import { http, createCustomAxios } from './apiConfig'

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
  static async login(data) {
      try {
          const response = await http.post("/user/login", data);
          return response.data; 
      } catch ({response}) {
          console.log("Error logging in:", response.data);
          return response.data;
      }
  }
  static async searchUser(data, headers) {
      try {
          const auth = createCustomAxios(headers)

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
  static async isFollowing(data, headers) {
      try {
          const auth = createCustomAxios(headers)
          const response = await auth.post("/user/isfollowing", data);
          return response.data;
      } catch ({response}) {
          console.log("Error checking if user profile is being followed by user:", response.data);
          return response.data;
      }
  }
}