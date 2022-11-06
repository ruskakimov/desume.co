import { useDispatch } from "react-redux";
import { appendComponent } from "../features/document/documentSlice";
import { HeadingComponent } from "../features/document/types";
import ComponentCard from "./ComponentCard";
import TextArea from "./TextArea";

export default function ComponentBar() {
  const dispatch = useDispatch();

  const heading: HeadingComponent = {
    text: "Hello",
  };

  return (
    <div className="p-4">
      <TextArea />
    </div>
  );
}
