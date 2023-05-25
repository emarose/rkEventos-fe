import axios, { AxiosInstance } from "axios";

//let baseURL = "https://rkeventos.fly.dev"
let baseURL = "http://localhost:3000"

const AxiosInstance = axios.create({
  baseURL: baseURL,
});

export default AxiosInstance;
