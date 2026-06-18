import DashboardCard from "../components/DashboardCard";

function Dashboard() {
    return (
        <div>
            <h2>Dashboard Overview</h2>


            <div className="card-container">
                <DashboardCard title="Total Sales" value="$12,345" />
                <DashboardCard title="Courses" value="123" />
                <DashboardCard title="Lecturers" value="45" />
            </div>
        </div>
    )
}

export default Dashboard;