import api from './api';

interface LoginResponse {
    authenticated: boolean;
    employeeId: number;
    firstName: string;
    lastName: string;
    userType: string;
    companyId: number;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', {
        username,
        password
    });
    return response.data;
}