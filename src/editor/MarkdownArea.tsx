import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setContent } from "../features/document/documentSlice";

export default function MarkdownArea() {
  const content = useSelector((state: RootState) => state.document.content);
  const dispatch = useDispatch();

  return (
    <div className="h-full">
      <textarea
        className="h-full w-full pl-4 pr-8 py-8 text-gray-5 text-lg border-none focus:border-none focus:ring-0 resize-none placeholder:text-gray-3"
        placeholder="Write here..."
        value={content}
        onChange={(e) => dispatch(setContent(e.target.value))}
      />
    </div>
  );
}
