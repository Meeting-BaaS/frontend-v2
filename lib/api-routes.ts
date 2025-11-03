// Base routes
// All internal routes (routes built for frontend use) are prefixed with /internal
export const BASE_PATH = "/internal";
// Auth routes
export const AUTH_BASE_PATH = `${BASE_PATH}/auth`;
export const GET_SESSION = `${AUTH_BASE_PATH}/get-session`;

// Team routes
export const GET_TEAM_DETAILS = `${BASE_PATH}/teams/details`;

// API keys routes
export const LIST_API_KEYS = `${AUTH_BASE_PATH}/api-key/list`;
export const CREATE_API_KEY = `${BASE_PATH}/api-keys/create`;
export const UPDATE_API_KEY = `${BASE_PATH}/api-keys/update`;
export const GET_API_KEY_DETAILS = `${BASE_PATH}/api-keys/details`;

// Webhook routes
export const LIST_WEBHOOK_EVENTS = `${BASE_PATH}/webhooks/list-events`;
export const LIST_WEBHOOK_ENDPOINTS = `${BASE_PATH}/webhooks/list-endpoints`;
export const LIST_WEBHOOK_MESSAGES = `${BASE_PATH}/webhooks/list-messages`;
export const GET_WEBHOOK_ENDPOINT_DETAILS = `${BASE_PATH}/webhooks/get-details`;
export const GET_WEBHOOK_MESSAGE_DETAILS = `${BASE_PATH}/webhooks/get-message-details`;
export const CREATE_WEBHOOK_ENDPOINT = `${BASE_PATH}/webhooks/create`;
export const UPDATE_WEBHOOK_ENDPOINT = `${BASE_PATH}/webhooks/update`;
export const DELETE_WEBHOOK_ENDPOINT = `${BASE_PATH}/webhooks/delete`;
export const DISABLE_WEBHOOK_ENDPOINT = `${BASE_PATH}/webhooks/disable`;
export const ENABLE_WEBHOOK_ENDPOINT = `${BASE_PATH}/webhooks/enable`;
export const ROTATE_WEBHOOK_ENDPOINT_SECRET = `${BASE_PATH}/webhooks/rotate-secret`;
export const RESEND_WEBHOOK_MESSAGE = `${BASE_PATH}/webhooks/resend`;

// Bots routes
export const LIST_BOTS = `${BASE_PATH}/bots/list`;
export const GET_BOT_DETAILS = `${BASE_PATH}/bots/details`;

// API logs routes
export const LIST_API_LOGS = `${BASE_PATH}/api-logs/list`;
export const GET_API_LOG_DETAILS = `${BASE_PATH}/api-logs/details`;

// Settings routes
export const GET_USAGE_STATS = `${BASE_PATH}/settings/usage/stats`;
