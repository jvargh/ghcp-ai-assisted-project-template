import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { getSurveyResults } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import type { SurveyResults, ApiError } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CHART_COLORS = [
  "rgba(99, 102, 241, 0.8)",
  "rgba(16, 185, 129, 0.8)",
  "rgba(245, 158, 11, 0.8)",
  "rgba(239, 68, 68, 0.8)",
  "rgba(139, 92, 246, 0.8)",
];

export default function SurveyResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<SurveyResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  useEffect(() => {
    async function load() {
      try {
        const data = await getSurveyResults(Number(id));
        setResults(data);
      } catch (err) {
        const apiErr = err as ApiError;
        setError(apiErr.error?.message ?? "Failed to load results");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!results) return <ErrorMessage message="Results not found" />;

  const { survey } = results;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
          <p className="text-gray-500">
            Total responses: {survey.totalResponses}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1.5 rounded text-sm ${
              chartType === "bar"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`px-3 py-1.5 rounded text-sm ${
              chartType === "pie"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pie Chart
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {survey.questions.map((question, qi) => (
          <div
            key={question.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {qi + 1}. {question.text}
            </h2>

            {/* Table */}
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600">Option</th>
                  <th className="text-right py-2 text-gray-600">Responses</th>
                  <th className="text-right py-2 text-gray-600">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {question.options.map((option) => {
                  const total = question.options.reduce(
                    (sum, o) => sum + o.count,
                    0
                  );
                  const pct =
                    total > 0
                      ? ((option.count / total) * 100).toFixed(1)
                      : "0.0";
                  return (
                    <tr
                      key={option.id}
                      className="border-b border-gray-100"
                    >
                      <td className="py-2 text-gray-800">{option.text}</td>
                      <td className="py-2 text-right text-gray-800">
                        {option.count}
                      </td>
                      <td className="py-2 text-right text-gray-800">
                        {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Chart */}
            <div className="h-64">
              {chartType === "bar" ? (
                <Bar
                  data={{
                    labels: question.options.map((o) => o.text),
                    datasets: [
                      {
                        label: "Responses",
                        data: question.options.map((o) => o.count),
                        backgroundColor: CHART_COLORS.slice(
                          0,
                          question.options.length
                        ),
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                      },
                    },
                  }}
                />
              ) : (
                <Pie
                  data={{
                    labels: question.options.map((o) => o.text),
                    datasets: [
                      {
                        data: question.options.map((o) => o.count),
                        backgroundColor: CHART_COLORS.slice(
                          0,
                          question.options.length
                        ),
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
