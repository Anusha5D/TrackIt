import Skeleton from './Skeleton';

const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-5">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-10 w-10 rounded-lg" />
    </div>
  </div>
);

const ChartSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <Skeleton className="h-5 w-40 mb-4" />
    <Skeleton className="h-64 w-full" />
  </div>
);

const ListSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-5 w-44" />
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

const DashboardSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ListSkeleton />
        <ListSkeleton />
      </div>
    </div>
  );
};

export default DashboardSkeleton;