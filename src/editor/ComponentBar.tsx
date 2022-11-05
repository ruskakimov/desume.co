import { useDispatch } from "react-redux";
import { appendComponent } from "../features/document/documentSlice";
import { HeadingComponent } from "../features/document/types";
import ComponentCard from "./ComponentCard";

export default function ComponentBar() {
  const dispatch = useDispatch();

  const heading: HeadingComponent = {
    text: "Hello",
  };

  return (
    <div className="p-4">
      <div onClick={() => dispatch(appendComponent(heading))}>
        <ComponentCard name="Heading" />
      </div>
      <ComponentCard name="Paragraph" />
      <ComponentCard name="Block" />
    </div>
  );
}
