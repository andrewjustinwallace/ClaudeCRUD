import axios from 'axios';
import { WorkloadSummary } from '../types/workload';

const BASE_URL = '/api/it';

export const workloadService = {
    getWorkloadSummary: async (): Promise<WorkloadSummary> => {
        const { data } = await axios.get(`${BASE_URL}/employee/workload`);
        return data;
    },

    getEmployeeWorkload: async (employeeId: string) => {
        const { data } = await axios.get(`${BASE_URL}/employee/${employeeId}/workload`);
        return data;
    }
};