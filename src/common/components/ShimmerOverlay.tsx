import classNames from "classnames";

const ShimmerOverlay: React.FC<{
  loading?: boolean;
  children: React.ReactNode;
}> = ({ loading = true, children }) => {
  return (
    <div className="relative">
      <div className={classNames({ "opacity-0": loading })}>{children}</div>
      {loading && (
        <div className="absolute inset-0 shimmer bg-gray-200 rounded-md animate-pulse" />
      )}
    </div>
  );
};

export default ShimmerOverlay;
