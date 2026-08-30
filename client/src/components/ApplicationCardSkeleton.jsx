import Skeleton from './Skeleton';

const ApplicationCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="space-y-2 mb-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <Skeleton className="h-4 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ApplicationCardSkeleton;