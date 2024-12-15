import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginResponse {
  authenticated: boolean;
  employeeId: number;
  firstName: string;
  lastName: string;
  userType: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password
  });
  return response.data;
}

export function logout(): void {
  localStorage.removeItem('user');
}

export function getCurrentUser(): LoginResponse | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}