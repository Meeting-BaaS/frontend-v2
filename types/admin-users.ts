/**
 * User shape returned by authClient.admin.listUsers (Better Auth admin plugin).
 * id is string in Better Auth API.
 */
export interface AdminListUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  banned: boolean;
  banReason?: string | null;
  banExpires?: string | null;
  createdAt?: string;
  updatedAt?: string;
  image?: string | null;
  emailVerified?: boolean;
}
