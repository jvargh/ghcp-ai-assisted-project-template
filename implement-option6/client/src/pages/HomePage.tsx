import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Survey App
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create, manage, and participate in surveys. Get valuable feedback and
          view results with interactive charts.
        </p>
      </section>

      {user ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {user.role === "coordinator" && (
            <>
              <DashboardCard
                title="Create Survey"
                description="Define a new survey with multiple-choice questions"
                to="/surveys/create"
                color="bg-green-50 border-green-200"
              />
              <DashboardCard
                title="Manage Surveys"
                description="Open or close your draft and active surveys"
                to="/surveys?status=draft"
                color="bg-yellow-50 border-yellow-200"
              />
            </>
          )}
          <DashboardCard
            title="Open Surveys"
            description="View and complete surveys that are currently open"
            to="/surveys?status=open"
            color="bg-blue-50 border-blue-200"
          />
          <DashboardCard
            title="View Results"
            description="See results for completed surveys with charts"
            to="/surveys?status=closed"
            color="bg-purple-50 border-purple-200"
          />
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Please login or register to get started.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-indigo-600 border border-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-50 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCard({
  title,
  description,
  to,
  color,
}: {
  title: string;
  description: string;
  to: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className={`block p-6 rounded-lg border ${color} hover:shadow-md transition-shadow`}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
