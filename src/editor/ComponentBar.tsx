import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { appendComponent } from "../features/document/documentSlice";
import ComponentCard from "./ComponentCard";

export default function ComponentBar() {
  const components = useSelector(
    (state: RootState) => state.document.components
  );
  const dispatch = useDispatch();

  return (
    <div className="p-4">
      <div onClick={() => dispatch(appendComponent(0))}>
        <ComponentCard name="Heading" />
      </div>
      <ComponentCard name="Paragraph" />
      <ComponentCard name="Block" />
      {components}
    </div>
  );
}
