/**
 * Request body type for creating a new team
 */
export interface CreateNewTeamRequest {
  name: string;
  plan: string;
  successUrl: string;
  cancelUrl: string;
  returnUrl: string;
}
