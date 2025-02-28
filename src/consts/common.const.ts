const env = (window as any).env || import.meta.env;

export const ACCESS_TOKEN = "accessToken";
export const API_URL = env.VITE_API_URL;
