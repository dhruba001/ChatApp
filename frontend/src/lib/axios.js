import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api", //* server url
  withCredentials: true, //* sending cookies with every request
});

//* here we'll make an instance that we can use throughout our application
