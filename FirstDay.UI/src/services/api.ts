import axios from 'axios';
import type {
    ITEmployeePendingTask,
    NewHireSetupStatus,
    ITEmployeeWorkload,
    TodaysTask,
    CompanyOnboardingProgress,
    OverdueTask
} from '@/types';

const api = axios.create({
    baseURL: '/api'
});

export const onboardingApi = {
    getITEmployeePendingTasks: async (id: number) => {
        const response = await api.get<ITEmployeePendingTask[]>(`/onboarding/it-employee/${id}/pending-tasks`);
        return response.data;
    },

    getNewHireSetupStatus: async (id: number) => {
        const response = await api.get<NewHireSetupStatus[]>(`/onboarding/new-hire/${id}/setup-status`);
        return response.data;
    },

    getITEmployeeWorkload: async () => {
        const response = await api.get<ITEmployeeWorkload[]>('/onboarding/it-employee/workload');
        return response.data;
    },

    getTodaysTasks: async () => {
        const response = await api.get<TodaysTask[]>('/onboarding/tasks/today');
        return response.data;
    },

    getCompanyOnboardingProgress: async (id: number) => {
        const response = await api.get<CompanyOnboardingProgress[]>(`/onboarding/company/${id}/onboarding-progress`);
        return response.data;
    },

    getOverdueTasks: async () => {
        const response = await api.get<OverdueTask[]>('/onboarding/tasks/overdue');
        return response.data;
    }
};