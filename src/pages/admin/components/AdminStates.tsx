export function AdminLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton metric cards — `bg-card-border` for the shimmer blocks: a
       * neutral translucent tone that reads as an empty/loading placeholder
       * in both themes (frontend has no skeleton pattern to port, so this is
       * this app's own choice, kept consistent everywhere loading UI needs
       * a placeholder block). */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <div className="relative h-3 w-20 bg-card-border rounded-full mb-3" />
            <div className="relative h-7 w-28 bg-card-border rounded-lg mb-2" />
            <div className="relative h-2 w-16 bg-card-border rounded-full" />
          </div>
        ))}
      </div>
      {/* Skeleton table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative p-4 border-b border-card-border">
          <div className="h-3 w-32 bg-card-border rounded-full" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="relative px-4 py-3.5 border-b border-card-border">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-card-border" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 bg-card-border rounded-full" />
                <div className="h-2 w-24 bg-card-border rounded-full" />
              </div>
              <div className="h-6 w-16 bg-card-border rounded-full" />
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
        <div className="w-16 h-16 mx-auto rounded-2xl bg-danger-soft border border-danger-soft flex items-center justify-center">
          <i className="ri-error-warning-line text-2xl text-danger"></i>
        </div>
        <h3 className="text-lg font-semibold text-fg mt-5">
          {message || 'Unable to load admin data'}
        </h3>
        <p className="text-sm text-fg-tertiary mt-2">
          Please retry or check platform monitoring for system health.
        </p>
        <button
          onClick={onRetry}
          className="mt-5 px-6 py-2.5 rounded-full bg-accent-soft border border-accent-soft text-accent text-sm font-semibold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
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
        <div className="w-16 h-16 mx-auto rounded-2xl bg-warning-soft border border-warning-soft flex items-center justify-center">
          <i className="ri-lock-line text-2xl text-warning"></i>
        </div>
        <h3 className="text-lg font-semibold text-fg mt-5">Permission required</h3>
        <p className="text-sm text-fg-tertiary mt-2">
          {userRole
            ? `Your role (${userRole}) does not allow access to this section.`
            : 'You do not have permission to access this section.'}
        </p>
        {onReturnToLogin && (
          <button
            onClick={onReturnToLogin}
            className="mt-5 px-6 py-2.5 rounded-full bg-warning-soft border border-warning-soft text-warning text-sm font-semibold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
          >
            Return to login
          </button>
        )}
      </div>
    </div>
  );
}