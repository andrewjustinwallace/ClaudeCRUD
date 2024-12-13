import TaskList from '../components/tasks/TaskList';

const Tasks = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tasks</h1>
            <TaskList />
        </div>
    );
};

export default Tasks;