import axios from "axios";
const { REACT_APP_PORT, REACT_APP_API_URL} = process.env;


if (!REACT_APP_PORT) {
    throw new Error("REACT_APP_PORT is not defined in the environment.");
}
if (!REACT_APP_API_URL) {
    throw new Error("REACT_APP_API_URL is not defined in the environment.");
}


export const http = axios.create({
    baseURL: REACT_APP_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const createCustomAxios = (headers) => {
    return axios.create({
        baseURL: REACT_APP_API_URL,
        headers,
    });
};
