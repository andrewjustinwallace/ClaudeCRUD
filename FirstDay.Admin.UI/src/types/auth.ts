export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  employeeId: number;
  firstName: string;
  lastName: string;
  userType: string;
}

export interface AuthResponse {
  authenticated: boolean;
  employeeId: number;
  firstName: string;
  lastName: string;
  userType: string;
}