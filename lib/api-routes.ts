// Base routes
// All internal routes (routes built for frontend use) are prefixed with /internal
export const BASE_PATH = "/internal";
// Auth routes
export const AUTH_BASE_PATH = `${BASE_PATH}/auth`;
export const GET_SESSION = `${AUTH_BASE_PATH}/get-session`;

// Team routes
export const TEAMS_BASE_PATH = `${BASE_PATH}/teams`;
export const GET_TEAM_DETAILS = `${TEAMS_BASE_PATH}/details`;

// API keys routes
export const API_KEYS_BASE_PATH = `${BASE_PATH}/api-keys`;
export const LIST_API_KEYS = `${AUTH_BASE_PATH}/api-key/list`;
export const CREATE_API_KEY = `${API_KEYS_BASE_PATH}/create`;
export const UPDATE_API_KEY = `${API_KEYS_BASE_PATH}/update`;
export const GET_API_KEY_DETAILS = `${API_KEYS_BASE_PATH}/details`;

// Webhook routes
export const WEBHOOKS_BASE_PATH = `${BASE_PATH}/webhooks`;
export const LIST_WEBHOOK_EVENTS = `${WEBHOOKS_BASE_PATH}/list-events`;
export const LIST_WEBHOOK_ENDPOINTS = `${WEBHOOKS_BASE_PATH}/list-endpoints`;
export const LIST_WEBHOOK_MESSAGES = `${WEBHOOKS_BASE_PATH}/list-messages`;
export const GET_WEBHOOK_ENDPOINT_DETAILS = `${WEBHOOKS_BASE_PATH}/get-details`;
export const GET_WEBHOOK_MESSAGE_DETAILS = `${WEBHOOKS_BASE_PATH}/get-message-details`;
export const CREATE_WEBHOOK_ENDPOINT = `${WEBHOOKS_BASE_PATH}/create`;
export const UPDATE_WEBHOOK_ENDPOINT = `${WEBHOOKS_BASE_PATH}/update`;
export const DELETE_WEBHOOK_ENDPOINT = `${WEBHOOKS_BASE_PATH}/delete`;
export const DISABLE_WEBHOOK_ENDPOINT = `${WEBHOOKS_BASE_PATH}/disable`;
export const ENABLE_WEBHOOK_ENDPOINT = `${WEBHOOKS_BASE_PATH}/enable`;
export const ROTATE_WEBHOOK_ENDPOINT_SECRET = `${WEBHOOKS_BASE_PATH}/rotate-secret`;
export const RESEND_WEBHOOK_MESSAGE = `${WEBHOOKS_BASE_PATH}/resend`;

// Bots routes
export const BOTS_BASE_PATH = `${BASE_PATH}/bots`;
export const LIST_BOTS = `${BOTS_BASE_PATH}/list`;
export const GET_BOT_DETAILS = `${BOTS_BASE_PATH}/details`;

// API logs routes
export const API_LOGS_BASE_PATH = `${BASE_PATH}/api-logs`;
export const LIST_API_LOGS = `${API_LOGS_BASE_PATH}/list`;
export const GET_API_LOG_DETAILS = `${API_LOGS_BASE_PATH}/details`;

// Settings routes
export const SETTINGS_BASE_PATH = `${BASE_PATH}/settings`;
export const GET_USAGE_STATS = `${SETTINGS_BASE_PATH}/usage/stats`;
export const GET_BILLING_INFO = `${SETTINGS_BASE_PATH}/billing/info`;
export const UPDATE_BILLING_EMAIL = `${SETTINGS_BASE_PATH}/billing/update-email`;
export const GET_CUSTOMER_PORTAL_URL = `${SETTINGS_BASE_PATH}/billing/customer-portal`;
