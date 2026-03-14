type PageSkeletonVariant =
  | "default"
  | "home"
  | "projects"
  | "timeline"
  | "contact"
  | "admin";

export default function PageSkeleton({
  variant = "default",
}: {
  variant?: PageSkeletonVariant;
}) {
  if (variant === "home") {
    return (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="h-3 w-40 bg-[var(--bg-card)] rounded" />
              <div className="h-12 w-4/5 bg-[var(--bg-card)] rounded" />
              <div className="h-5 w-3/5 bg-[var(--bg-card)] rounded" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-[var(--bg-card)] rounded" />
                <div className="h-4 w-11/12 bg-[var(--bg-card)] rounded" />
                <div className="h-4 w-2/3 bg-[var(--bg-card)] rounded" />
              </div>
              <div className="flex gap-3 pt-4">
                <div className="h-10 w-40 bg-[var(--bg-card)] rounded" />
                <div className="h-10 w-32 bg-[var(--bg-card)] rounded" />
              </div>
            </div>
            <div className="h-[420px] bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]" />
          </div>
          <div className="h-14 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]" />
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "projects") {
    return (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-10 animate-pulse">
          <div className="space-y-3">
            <div className="h-3 w-36 bg-[var(--bg-card)] rounded" />
            <div className="h-10 w-80 bg-[var(--bg-card)] rounded" />
            <div className="h-4 w-2/3 bg-[var(--bg-card)] rounded" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 w-28 bg-[var(--bg-card)] rounded" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[32rem] rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "timeline") {
    return (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-10 animate-pulse">
          <div className="space-y-3">
            <div className="h-3 w-40 bg-[var(--bg-card)] rounded" />
            <div className="h-10 w-72 bg-[var(--bg-card)] rounded" />
            <div className="h-4 w-3/5 bg-[var(--bg-card)] rounded" />
          </div>
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "contact") {
    return (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-10 animate-pulse">
          <div className="space-y-3">
            <div className="h-3 w-40 bg-[var(--bg-card)] rounded" />
            <div className="h-10 w-72 bg-[var(--bg-card)] rounded" />
            <div className="h-4 w-3/5 bg-[var(--bg-card)] rounded" />
          </div>
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-5">
              <div className="h-52 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]" />
              <div className="h-40 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]" />
            </div>
            <div className="md:col-span-3 h-[28rem] rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "admin") {
    return (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-14 rounded border border-[var(--border-color)] bg-[var(--bg-card)]" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 w-28 bg-[var(--bg-card)] rounded" />
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-3 w-36 bg-[var(--bg-card)] rounded" />
          <div className="h-10 w-72 bg-[var(--bg-card)] rounded" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
