import { Config } from "./constants";

const DEV_URL = {
  ROOT_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1",
};



export { Config };
export default DEV_URL; 