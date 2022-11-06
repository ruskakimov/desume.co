export default function TextArea() {
  return (
    <div>
      <label
        htmlFor="comment"
        className="block text-sm font-medium text-gray-5"
      >
        Content
      </label>
      <div className="mt-1">
        <textarea
          rows={4}
          name="comment"
          id="comment"
          className="block w-full rounded-md border-gray-3 focus:border-gray-4 focus:ring-0 shadow-sm sm:text-sm"
          defaultValue={""}
        />
      </div>
    </div>
  );
}
