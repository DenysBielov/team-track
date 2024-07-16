import axios from "axios";
import { handleDates } from "./utils";

const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL })

client.interceptors.response.use(originalResponse => {
  handleDates(originalResponse.data);

  return originalResponse;
})

export default client;