export default function Home() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Survey App</h1>
      <p className="text-lg text-gray-600 mb-8">
        Create, conduct, and view surveys
      </p>
      <div className="flex gap-6 justify-center flex-wrap">
        <div className="rounded-lg border border-gray-200 bg-white p-6 max-w-sm">
          <h2 className="text-xl font-semibold mb-2">Survey Coordinators</h2>
          <p className="text-gray-500">
            Define and manage surveys, open them for responses, and view results.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 max-w-sm">
          <h2 className="text-xl font-semibold mb-2">Survey Respondents</h2>
          <p className="text-gray-500">
            Complete open surveys and view results of closed surveys.
          </p>
        </div>
      </div>
    </div>
  );
}
