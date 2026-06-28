export interface LoginResponse {
  token: string;
  refreshToken: string;
  email: string;
  roles: string[];
  userId: string;
}
