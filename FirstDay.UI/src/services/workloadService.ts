import api from './api';
import { WorkloadSummary } from '../types/workload';

export const workloadService = {
    getWorkloadSummary: async (): Promise<WorkloadSummary> => {
        const { data } = await api.get('/itemployee/workload');
        return data;
    },

    getEmployeeWorkload: async (employeeId: string) => {
        const { data } = await api.get(`/itemployee/${employeeId}/workload`);
        return data;
    }
};