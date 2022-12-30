const ShimmerOverlay: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="relative">
      <div className="opacity-0">{children}</div>
      <div className="absolute inset-0 shimmer bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  );
};

export default ShimmerOverlay;
