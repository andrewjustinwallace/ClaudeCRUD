import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@tremor/react';

export default function NewHireProgress() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (id) {
        try {
          // TODO: Implement progress loading logic when API is ready
          setLoading(false);
        } catch (error) {
          console.error('Error loading progress:', error);
          setLoading(false);
        }
      }
    };
    loadProgress();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <h1 className="text-2xl font-bold mb-4">New Hire Progress</h1>
        {/* Add progress content here */}
      </Card>
    </div>
  );
}