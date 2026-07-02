// NO API: The token ingestion / approval queue has no backend endpoint — the
// backend ingests tokens automatically and has no pending-review workflow. This
// page is disabled (removed from the router and sidebar). The original
// mock-driven implementation was removed to keep the build type-clean; restore
// from git history if a queue API is added later.
export default function TokenIngestionQueue() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#A69DB7]/10 border border-[#A69DB7]/20 flex items-center justify-center">
          <i className="ri-inbox-archive-line text-2xl text-[#A69DB7]"></i>
        </div>
        <h3 className="text-lg font-semibold text-[#F6F2EA] mt-5">
          Token Queue unavailable
        </h3>
        <p className="text-sm text-[#A69DB7] mt-2">
          There is no token ingestion/approval API. Manage tokens from Token
          Moderation instead.
        </p>
      </div>
    </div>
  );
}
