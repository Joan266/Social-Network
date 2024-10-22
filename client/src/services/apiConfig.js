import axios from "axios";
const { REACT_APP_PORT } = process.env;

if (!REACT_APP_PORT) {
    throw new Error("REACT_APP_PORT is not defined in the environment.");
}

const URL = `http://5.250.191.193:8447/api`;

export const http = axios.create({
    baseURL: URL,
    headers: { 'Content-Type': 'application/json' },
});

export const createCustomAxios = (headers) => {
    return axios.create({
        baseURL: URL,
        headers,
    });
};
