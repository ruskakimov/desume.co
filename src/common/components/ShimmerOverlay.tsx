import classNames from "classnames";
import { twMerge } from "tailwind-merge";

const ShimmerOverlay: React.FC<{
  className?: string;
  loading?: boolean;
  children: React.ReactNode;
}> = ({ className = "", loading = true, children }) => {
  return (
    <div className="relative">
      <div className={classNames({ "opacity-0": loading })}>{children}</div>
      {loading && (
        <div
          className={twMerge(
            classNames(
              "absolute inset-0 shimmer bg-gray-200 rounded-md animate-pulse",
              className
            )
          )}
        />
      )}
    </div>
  );
};

export default ShimmerOverlay;
