import api from './api';

export interface Company {
    companyId: number;
    companyName: string;
}

export interface LoginResponse {
    authenticated: boolean;
    employeeId: number;
    firstName: string;
    lastName: string;
    userType: string;
    token: string;
    companies: Company[];
}

export interface User extends LoginResponse {
    selectedCompanyId?: number;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
    // Adding explicit POST method and headers
    const response = await api.post('/auth/login', 
        {
            username,
            password
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
}

export async function logout(): Promise<void> {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminEmployeeName');
}

export function getCurrentUser(): User | null {
    const userStr = localStorage.getItem('adminUser');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr) as User;
    } catch {
        return null;
    }
}