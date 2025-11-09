// Base routes
// All internal routes (routes built for frontend use) are prefixed with /internal
export const BASE_PATH = "/internal";
// Auth routes
export const AUTH_BASE_PATH = `${BASE_PATH}/auth`;
export const GET_SESSION = `${AUTH_BASE_PATH}/get-session`;
export const LIST_ACTIVE_SUBSCRIPTIONS = `${AUTH_BASE_PATH}/subscription/list`;

// Team routes
export const TEAMS_BASE_PATH = `${BASE_PATH}/teams`;
export const GET_TEAM_DETAILS = `${TEAMS_BASE_PATH}/details`;
export const LIST_TEAM_MEMBERS = `${TEAMS_BASE_PATH}/members`;
export const UPLOAD_TEAM_LOGO = `${TEAMS_BASE_PATH}/upload-logo`;
export const REMOVE_TEAM_LOGO = `${TEAMS_BASE_PATH}/remove-logo`;
export const DELETE_TEAM = `${TEAMS_BASE_PATH}/delete`;
export const GET_INVITATION = `${TEAMS_BASE_PATH}/invitation`;
export const CREATE_DEFAULT_TEAM = `${TEAMS_BASE_PATH}/create-default`;
export const CREATE_NEW_TEAM = `${TEAMS_BASE_PATH}/create-new`;

// API keys routes
export const API_KEYS_BASE_PATH = `${BASE_PATH}/api-keys`;
export const LIST_API_KEYS = `${API_KEYS_BASE_PATH}/list`;
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
export const LIST_INVOICES = `${SETTINGS_BASE_PATH}/billing/invoices`;
export const GET_PLANS = `${SETTINGS_BASE_PATH}/plans`;
export const GET_TOKEN_PACKS = `${SETTINGS_BASE_PATH}/token-packs`;
export const PURCHASE_TOKEN_PACK = `${SETTINGS_BASE_PATH}/token-packs/purchase`;
export const UPDATE_AUTO_REFILL_SETTINGS = `${SETTINGS_BASE_PATH}/token-settings/auto-refill`;
export const UPDATE_REMINDER_SETTINGS = `${SETTINGS_BASE_PATH}/token-settings/reminder`;

// Account routes
export const ACCOUNT_BASE_PATH = `${BASE_PATH}/account`;
export const UPLOAD_USER_IMAGE = `${ACCOUNT_BASE_PATH}/upload-image`;
export const REMOVE_USER_IMAGE = `${ACCOUNT_BASE_PATH}/remove-image`;
export const CHECK_CREDENTIAL_ACCOUNT = `${ACCOUNT_BASE_PATH}/check-credential-account`;
export const LIST_USER_INVITATIONS = `${ACCOUNT_BASE_PATH}/list-invitations`;
export const GET_EMAIL_PREFERENCES = `${ACCOUNT_BASE_PATH}/email-preferences`;
export const UPDATE_EMAIL_PREFERENCES = `${ACCOUNT_BASE_PATH}/email-preferences`;

// Support Center
export const SUPPORT_BASE_PATH = `${BASE_PATH}/support`;
export const LIST_SUPPORT_TICKETS = `${SUPPORT_BASE_PATH}/list`;
export const CREATE_SUPPORT_TICKET = `${SUPPORT_BASE_PATH}/create`;
export const GET_TICKET_DETAILS = `${SUPPORT_BASE_PATH}/get-details`;
export const UPDATE_TICKET = `${SUPPORT_BASE_PATH}/update`;
export const UPDATE_TICKET_STATUS = `${SUPPORT_BASE_PATH}/update-status`;
export const UPLOAD_ATTACHMENTS = `${SUPPORT_BASE_PATH}/upload-attachments`;
