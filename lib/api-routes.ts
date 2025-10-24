// Base routes
// All internal routes (routes built for frontend use) are prefixed with /internal
export const BASE_PATH = "/internal";
// Auth routes
export const AUTH_BASE_PATH = `${BASE_PATH}/auth`;
export const GET_SESSION = `${AUTH_BASE_PATH}/get-session`;
export const LIST_API_KEYS = `${AUTH_BASE_PATH}/api-key/list`;

// Team routes
export const GET_TEAM_DETAILS = `${BASE_PATH}/teams/details`;

// API keys routes
export const CREATE_API_KEY = `${BASE_PATH}/api-keys/create`;
export const UPDATE_API_KEY = `${BASE_PATH}/api-keys/update`;
export const GET_API_KEY_DETAILS = `${BASE_PATH}/api-keys/details`;
