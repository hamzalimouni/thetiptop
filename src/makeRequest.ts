import axios from "axios";

const BASE_URL: string = import.meta.env.VITE_REACT_APP_API_URL;

export const publicRequest = axios.create({
    baseURL: BASE_URL,
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
})
