import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7201/api'
});

api.interceptors.request.use((config) => {
    const user = localStorage.getItem('adminUser');
    if (user) {
        const userData = JSON.parse(user);
        config.headers.Authorization = `Bearer ${userData.token}`;
    }
    return config;
});

export default api;