import axios from "axios";
const { REACT_APP_PORT } = process.env;

if (!REACT_APP_PORT) {
    throw new Error("REACT_APP_PORT is not defined in the environment.");
}

const URL = `http://localhost:${REACT_APP_PORT}/api`;

const http = axios.create({
    baseURL: URL,
    headers: { 'Content-Type': 'application/json' },
});

export class filesApi {
    static async upload(formData,headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });
            const response = await auth.post("/files/upload", formData);
            return response.data; 
        } catch ({response}) {
            console.log("Error uploading file:", response.error);
        }
    }
    static async image(fileId,headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers, 
            });
            const response = await auth.get("/files/image", {
                params: { fileId },
                responseType: 'blob'
            });
            return response.data; 
        } catch ({response}) {
            console.log("Error showing image:", response.error);
        }
    }
    static async delete({fileId,userToken}) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                  }, 
            });
            await auth.delete("/files/delete", {
                params: { fileId }
            });
        } catch ({response}) {
            console.log("Error deleting file:", response.error);
        }
    }
}

export class postApi {
    
    static async fetchPostData(query, headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

            const response = await auth.get("/post/fetchdata", {
                params: { query },
            });
            return response.data;
        } catch ({response}) {
            console.log("Error post not found:", response.data);
            return response.data;
        }
    }
    static async create(data,headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });
            const response = await auth.post("/post/create", data);
            return response.data; 
        } catch ({response}) {
            console.log("Error creating post:", response.error);
        }
    }
    static async likePost(data, headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

            const response = await auth.put("/post/like", data);
            return response.data;
        } catch ({response}) {
            console.log("Error liking post:", response.data);
            return response.data;
        }
    }
    static async unlikePost(data, headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

            const response = await auth.put("/post/unlike", data);
            return response.data;
        } catch ({response}) {
            console.log("Error unliking post:", response.data);
            return response.data;
        }
    }
    static async isLiking(data, headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });
            const response = await auth.post("/post/isliking", data);
            return response.data;
        } catch ({response}) {
            console.log("Error checking if post is being liked by user:", response.data);
            return response.data;
        }
    }
    static async fetchHomePosts(data, headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

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
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

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
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

            const response = await auth.post("/user/search", data);
            return response.data;
        } catch (error) {
            console.log("Error searching user:", error);
        }
    }
    static async fetchUserData(query, headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

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
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

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
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

            const response = await auth.put("/user/follow", data);
            return response.data;
        } catch ({response}) {
            console.log("Error following user:", response.data);
            return response.data;
        }
    }
    static async unfollowUser(data, headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

            const response = await auth.put("/user/unfollow", data);
            return response.data;
        } catch ({response}) {
            console.log("Error unfollowing user:", response.data);
            return response.data;
        }
    }
    static async updateProfileData(data, headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

            const response = await auth.put("/user/updateprofiledata", data);
            return response.data;
        } catch ({response}) {
            console.log("Error updating profile data:", response.data);
            return response.data;
        }
    }
    static async isFollowing(data, headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });
            const response = await auth.post("/user/isfollowing", data);
            return response.data;
        } catch ({response}) {
            console.log("Error checking if user profile is being followed by user:", response.data);
            return response.data;
        }
    }
}
