// Common HTTP status codes
export const HTTP_STATUSES = [
  { value: 200, label: "200 OK", variant: "success" as const },
  { value: 201, label: "201 Created", variant: "success" as const },
  { value: 204, label: "204 No Content", variant: "success" as const },
  { value: 400, label: "400 Bad Request", variant: "error" as const },
  { value: 401, label: "401 Unauthorized", variant: "error" as const },
  { value: 402, label: "402 Payment Required", variant: "error" as const },
  { value: 403, label: "403 Forbidden", variant: "error" as const },
  { value: 404, label: "404 Not Found", variant: "error" as const },
  { value: 422, label: "422 Unprocessable", variant: "error" as const },
  { value: 429, label: "429 Rate Limited", variant: "error" as const },
  { value: 500, label: "500 Internal Error", variant: "error" as const },
  { value: 502, label: "502 Bad Gateway", variant: "error" as const },
  { value: 503, label: "503 Unavailable", variant: "error" as const },
];
