const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`}
      aria-hidden="true"
    />
  );
};

export default Skeleton;