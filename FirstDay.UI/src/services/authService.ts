import api from './api';

interface Company {
    companyId: number;
    companyName: string;
}

interface LoginResponse {
    authenticated: boolean;
    employeeId: number;
    firstName: string;
    lastName: string;
    userType: string;
    companies: Company[];
}

export async function login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', {
        username,
        password
    });
    return response.data;
}