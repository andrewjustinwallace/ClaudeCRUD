import WorkloadChart from "../components/dashboard/workload/WorkloadChart";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Dashboard for {localStorage.getItem("companyName")}
      </h1>
      <WorkloadChart />
    </div>
  );
};

export default Dashboard;
