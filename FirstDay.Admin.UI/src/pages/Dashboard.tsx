import { useEffect, useState } from 'react';
import { Card } from '@tremor/react';
import { adminService } from '@/services/adminService';
import type { CompanyStatistics } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState<CompanyStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminService.getCompanyStatistics();
        setStats(data);
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {stats && (
          <div>
            <pre>{JSON.stringify(stats, null, 2)}</pre>
          </div>
        )}
      </Card>
    </div>
  );
}