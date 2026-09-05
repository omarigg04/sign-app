import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-4 py-8">
        {/* Logo */}
        <div className="mb-12">
          <Skeleton className="h-24 w-40" />
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 space-y-6"
            >
              {/* Title */}
              <Skeleton className="h-4 w-32" />

              {/* Large number */}
              <div className="space-y-2">
                <Skeleton className="h-12 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Info section */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Button */}
              <Skeleton className="h-10 w-full rounded-md" />

              {/* Divider and more info */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
