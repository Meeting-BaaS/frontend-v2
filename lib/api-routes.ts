// Base routes
// All internal routes (routes built for frontend use) are prefixed with /internal
// BFF routes (Backend for Frontend) use /bff and reuse public API handlers with snake_case
export const BASE_PATH = "/v2-internal";
export const BFF_BASE_PATH = "/bff";

// Configuration route (no auth required, public info)
export const GET_CONFIGURATION = `${BASE_PATH}/configuration`;

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
export const AFTER_LEAVE_CLEANUP = `${TEAMS_BASE_PATH}/after-leave-cleanup`;

// API keys routes
export const API_KEYS_BASE_PATH = `${BASE_PATH}/api-keys`;
export const LIST_API_KEYS = `${API_KEYS_BASE_PATH}/list`;
export const CREATE_API_KEY = `${API_KEYS_BASE_PATH}/create`;
export const UPDATE_API_KEY = `${API_KEYS_BASE_PATH}/update`;
export const GET_API_KEY_DETAILS = `${API_KEYS_BASE_PATH}/details`;
export const DELETE_API_KEY = `${API_KEYS_BASE_PATH}/delete`;

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

// Bots routes (BFF - reuses public API handlers with snake_case)
export const BFF_BOTS_BASE_PATH = `${BFF_BASE_PATH}/bots`;
export const LIST_BOTS = `${BFF_BOTS_BASE_PATH}`;
// Note: bot_id is passed as a path parameter, not in the route constant
export const GET_BOT_DETAILS = (botId: string) =>
  `${BFF_BOTS_BASE_PATH}/${botId}`;
export const GET_BOT_STATUS = (botId: string) =>
  `${BFF_BOTS_BASE_PATH}/${botId}/status`;
export const GET_BOT_SCREENSHOTS = (botId: string) =>
  `${BFF_BOTS_BASE_PATH}/${botId}/screenshots`;
export const LEAVE_BOT = (botId: string) =>
  `${BFF_BOTS_BASE_PATH}/${botId}/leave`;
export const DELETE_BOT_DATA = (botId: string) =>
  `${BFF_BOTS_BASE_PATH}/${botId}/delete-data`;
export const RESEND_FINAL_WEBHOOK = (botId: string) =>
  `${BFF_BOTS_BASE_PATH}/${botId}/resend-webhook`;
export const RETRY_CALLBACK = (botId: string) =>
  `${BFF_BOTS_BASE_PATH}/${botId}/retry-callback`;

// Scheduled bots routes (BFF - reuses public API handlers with snake_case)
export const BFF_SCHEDULED_BOTS_BASE_PATH = `${BFF_BASE_PATH}/bots/scheduled`;
export const LIST_SCHEDULED_BOTS = `${BFF_SCHEDULED_BOTS_BASE_PATH}`;
// Note: bot_id is passed as a path parameter, not in the route constant
export const GET_SCHEDULED_BOT_DETAILS = (botId: string) =>
  `${BFF_SCHEDULED_BOTS_BASE_PATH}/${botId}`;
export const UPDATE_SCHEDULED_BOT = (botId: string) =>
  `${BFF_SCHEDULED_BOTS_BASE_PATH}/${botId}`;
export const DELETE_SCHEDULED_BOT = (botId: string) =>
  `${BFF_SCHEDULED_BOTS_BASE_PATH}/${botId}`;

// Calendar routes (BFF - reuses public API handlers with snake_case)
export const BFF_CALENDARS_BASE_PATH = `${BFF_BASE_PATH}/calendars`;
export const LIST_CALENDARS = `${BFF_CALENDARS_BASE_PATH}`;
// Note: calendar_id and event_id are passed as path parameters, not in the route constant
export const GET_CALENDAR_DETAILS = (calendarId: string) =>
  `${BFF_CALENDARS_BASE_PATH}/${calendarId}`;
export const LIST_CALENDAR_EVENTS = (calendarId: string) =>
  `${BFF_CALENDARS_BASE_PATH}/${calendarId}/events`;
export const LIST_CALENDAR_EVENT_SERIES = (calendarId: string) =>
  `${BFF_CALENDARS_BASE_PATH}/${calendarId}/series`;
export const GET_CALENDAR_EVENT_DETAILS = (
  calendarId: string,
  eventId: string,
) => `${BFF_CALENDARS_BASE_PATH}/${calendarId}/events/${eventId}`;

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
export const GET_V1_AVAILABLE_TOKENS = `${SETTINGS_BASE_PATH}/tokens/v1-available`;
export const IMPORT_TOKENS_FROM_V1 = `${SETTINGS_BASE_PATH}/tokens/import-from-v1`;

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

// Admin routes
export const ADMIN_BASE_PATH = `${BASE_PATH}/admin`;
export const ADMIN_BOTS_BASE_PATH = `${ADMIN_BASE_PATH}/bots`;
export const ADMIN_LIST_BOTS = `${ADMIN_BOTS_BASE_PATH}/list`;
export const ADMIN_GET_BOT_DETAILS = (botId: string) =>
  `${ADMIN_BOTS_BASE_PATH}/${botId}/details`;
export const ADMIN_LEAVE_BOT = (botId: string) =>
  `${ADMIN_BOTS_BASE_PATH}/${botId}/leave`;
export const ADMIN_TEAMS_BASE_PATH = `${ADMIN_BASE_PATH}/teams`;
export const ADMIN_LIST_TEAMS = `${ADMIN_TEAMS_BASE_PATH}/list`;
export const ADMIN_GET_TEAM_DETAILS = (teamId: number) =>
  `${ADMIN_TEAMS_BASE_PATH}/${teamId}/details`;
export const ADMIN_UPDATE_RATE_LIMITS = (teamId: number) =>
  `${ADMIN_TEAMS_BASE_PATH}/${teamId}/update-rate-limits`;
export const ADMIN_TOKEN_OPERATIONS = (teamId: number) =>
  `${ADMIN_TEAMS_BASE_PATH}/${teamId}/token-operations`;
export const ADMIN_CREATE_SUPPORT_TICKET = (teamId: number) =>
  `${ADMIN_TEAMS_BASE_PATH}/${teamId}/support-tickets/create`;
export const ADMIN_SUPPORT_BASE_PATH = `${ADMIN_BASE_PATH}/support`;
export const ADMIN_LIST_SUPPORT_TICKETS = `${ADMIN_SUPPORT_BASE_PATH}/list`;
export const ADMIN_GET_TICKET_DETAILS = `${ADMIN_SUPPORT_BASE_PATH}/get-details`;
export const ADMIN_REPLY_TICKET = (ticketId: string) =>
  `${ADMIN_SUPPORT_BASE_PATH}/${ticketId}/reply`;
export const ADMIN_UPDATE_TICKET_STATUS = (ticketId: string) =>
  `${ADMIN_SUPPORT_BASE_PATH}/${ticketId}/update-status`;
export const ADMIN_MIGRATION_BASE_PATH = `${ADMIN_BASE_PATH}/migration`;
export const ADMIN_MIGRATE_USERS = `${ADMIN_MIGRATION_BASE_PATH}/migrate-users`;
