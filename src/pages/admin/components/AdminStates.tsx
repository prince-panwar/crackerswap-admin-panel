export function AdminLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 p-5">
            <div className="h-3 w-20 bg-[#1A1A2E] rounded-full mb-3" />
            <div className="h-7 w-28 bg-[#1A1A2E] rounded-lg mb-2" />
            <div className="h-2 w-16 bg-[#1A1A2E] rounded-full" />
          </div>
        ))}
      </div>
      {/* Skeleton table */}
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="p-4 border-b border-[#1A1A2E]/40">
          <div className="h-3 w-32 bg-[#1A1A2E] rounded-full" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-4 py-3.5 border-b border-[#1A1A2E]/20">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-[#1A1A2E]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 bg-[#1A1A2E] rounded-full" />
                <div className="h-2 w-24 bg-[#1A1A2E] rounded-full" />
              </div>
              <div className="h-6 w-16 bg-[#1A1A2E] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AdminErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export function AdminErrorState({ onRetry, message }: AdminErrorStateProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FF5B5B]/10 border border-[#FF5B5B]/20 flex items-center justify-center">
          <i className="ri-error-warning-line text-2xl text-[#FF5B5B]"></i>
        </div>
        <h3 className="text-lg font-semibold text-[#F6F2EA] mt-5">
          {message || 'Unable to load admin data'}
        </h3>
        <p className="text-sm text-[#A69DB7] mt-2">
          Please retry or check platform monitoring for system health.
        </p>
        <button
          onClick={onRetry}
          className="mt-5 px-6 py-2.5 rounded-full bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 text-[#7B61FF] text-sm font-semibold hover:bg-[#6C4DFF]/20 transition-all cursor-pointer whitespace-nowrap"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

interface PermissionDeniedStateProps {
  userRole?: string;
  onReturnToLogin?: () => void;
}

export function PermissionDeniedState({ userRole, onReturnToLogin }: PermissionDeniedStateProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FF8A3D]/10 border border-[#FF8A3D]/20 flex items-center justify-center">
          <i className="ri-lock-line text-2xl text-[#FF8A3D]"></i>
        </div>
        <h3 className="text-lg font-semibold text-[#F6F2EA] mt-5">Permission required</h3>
        <p className="text-sm text-[#A69DB7] mt-2">
          {userRole
            ? `Your role (${userRole}) does not allow access to this section.`
            : 'You do not have permission to access this section.'}
        </p>
        {onReturnToLogin && (
          <button
            onClick={onReturnToLogin}
            className="mt-5 px-6 py-2.5 rounded-full bg-[#FF8A3D]/10 border border-[#FF8A3D]/20 text-[#FF8A3D] text-sm font-semibold hover:bg-[#FF8A3D]/20 transition-all cursor-pointer whitespace-nowrap"
          >
            Return to login
          </button>
        )}
      </div>
    </div>
  );
}