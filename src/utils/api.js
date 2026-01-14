import axios from "axios";

const API = axios.create({
  baseURL: "https://api.compliancexconsultants.in/api",
});

export default API;
