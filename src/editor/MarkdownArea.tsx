export default function MarkdownArea() {
  return (
    <div className="h-full">
      <textarea
        className="h-full w-full px-4 py-8 text-gray-5 text-lg border-none focus:border-none focus:ring-0 resize-none placeholder:text-gray-3"
        placeholder="Write here..."
      />
    </div>
  );
}
