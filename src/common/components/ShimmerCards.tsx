const ShimmerCards: React.FC<{ count: number }> = ({ count }) => {
  return (
    <>
      {Array(count)
        .fill(null)
        .map((_) => (
          <div className="h-40 shimmer bg-gray-200 rounded-md animate-pulse" />
        ))}
    </>
  );
};

export default ShimmerCards;
