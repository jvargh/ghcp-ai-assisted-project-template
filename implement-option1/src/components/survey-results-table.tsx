import type { SurveyResults } from "@/types";

interface SurveyResultsTableProps {
  results: SurveyResults;
}

export function SurveyResultsTable({ results }: SurveyResultsTableProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{results.surveyTitle}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Total responses: {results.totalResponses}
        </p>
      </div>

      {results.questions.map((question, qIndex) => (
        <div
          key={question.questionId}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">
              {qIndex + 1}. {question.questionText}
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">
                  Selection
                </th>
                <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">
                  Responses
                </th>
              </tr>
            </thead>
            <tbody>
              {question.selections.map((selection) => (
                <tr
                  key={selection.selectionId}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {selection.selectionText}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                    {selection.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
