import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    getCompanyWorkloadDistribution, 
    getNewHireOnboardingStatus 
} from '../../services/companyService';
import { 
    CompanyWorkloadDistribution,
    NewHireOnboardingStatus 
} from '../../types/Company';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Progress } from '../ui/progress';

export const CompanyDashboard: React.FC = () => {
    const { id } = useParams();
    const [workload, setWorkload] = useState<CompanyWorkloadDistribution[]>([]);
    const [onboarding, setOnboarding] = useState<NewHireOnboardingStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadDashboardData(parseInt(id));
        }
    }, [id]);

    const loadDashboardData = async (companyId: number) => {
        try {
            const [workloadData, onboardingData] = await Promise.all([
                getCompanyWorkloadDistribution(companyId),
                getNewHireOnboardingStatus(companyId)
            ]);
            setWorkload(workloadData);
            setOnboarding(onboardingData);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Company Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* IT Employee Workload Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>IT Employee Workload</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {workload.map((employee) => (
                                <div key={employee.itEmployeeId} className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{employee.employeeName}</span>
                                        <span className="text-gray-600">
                                            {employee.activeAssignments} active / {employee.completedAssignments} completed
                                        </span>
                                    </div>
                                    <Progress 
                                        value={
                                            (employee.completedAssignments / 
                                            (employee.activeAssignments + employee.completedAssignments)) * 100
                                        } 
                                    />
                                    <p className="text-sm text-gray-600">
                                        Average completion time: {employee.averageTaskCompletionTime.toFixed(1)} days
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* New Hire Onboarding Status Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>New Hire Onboarding Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {onboarding.map((hire) => (
                                <div key={hire.newHireId} className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{hire.name}</span>
                                        <span className="text-gray-600">
                                            {hire.completedTasks} / {hire.totalTasks} tasks
                                        </span>
                                    </div>
                                    <Progress 
                                        value={(hire.completedTasks / hire.totalTasks) * 100} 
                                    />
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Started: {new Date(hire.startDate).toLocaleDateString()}</span>
                                        <span>Assigned to: {hire.assignedTo}</span>
                                    </div>
                                    <span className={`text-sm px-2 py-1 rounded-full ${
                                        hire.status === 'Completed' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {hire.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};