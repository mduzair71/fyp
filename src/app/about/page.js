export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black mb-3">How MahalAI works</h1>
        <p className="text-slate-600 mb-6">
          Report. Verify. Prioritize. Resolve. MahalAI turns citizen reports into structured civic intelligence
          with AI classification, duplicate detection, priority scoring, GIS, and community verification.
        </p>
        <ol className="space-y-3 text-sm text-slate-700 list-decimal pl-5">
          <li>Citizen submits a report with text, photo, and location.</li>
          <li>AI classifies the issue, scores priority, and recommends a department.</li>
          <li>Nearby similar reports are flagged as possible duplicates or clusters.</li>
          <li>The matching Sub Admin reviews only assigned areas and categories.</li>
          <li>Resolution evidence is uploaded, then citizens confirm whether it is actually fixed.</li>
        </ol>
      </div>
    </div>
  );
}
