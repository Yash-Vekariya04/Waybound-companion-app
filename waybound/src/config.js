const DEV_SERVER = "http://localhost:3000";
const PROD_SERVER = "https://waybound-server.onrender.com";

// true = use your laptop server
// false = use live Render server
const IS_DEV = false;

export const SERVER_URL = IS_DEV ? DEV_SERVER : PROD_SERVER;
export const API_URL = `${SERVER_URL}/api`;