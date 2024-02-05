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
export class ApiRouter {
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
    static async searchUser(query, headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

            const response = await auth.get("/user/search", {
                params: { query },
            });
            return response.data;
        } catch (error) {
            console.log("Error searching user:", error);
        }
    }
    static async getUser(query, headers) {
        try {
            const auth = axios.create({
                baseURL: URL,
                headers,
            });

            const response = await auth.get("/user/get", {
                params: { query },
            });
            return response.data;
        } catch ({response}) {
            console.log("Error user not found:", response.data);
            return response.data;
        }
    }
}
