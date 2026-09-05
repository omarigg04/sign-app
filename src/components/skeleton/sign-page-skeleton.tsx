import { Skeleton } from '@/components/ui/skeleton';

export function SignPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-8 w-32" />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Controls */}
          <div className="space-y-6">
            {/* Upload section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            {/* Signature section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Center/Right - PDF Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
              {/* PDF Header */}
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>

              {/* PDF Canvas area */}
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
