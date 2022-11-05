import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";

export default function ConfigurationBar() {
  const { components, selectedComponentIndex } = useSelector(
    (state: RootState) => state.document
  );
  const dispatch = useDispatch();

  const selectedComponent =
    selectedComponentIndex !== undefined
      ? components[selectedComponentIndex]
      : null;

  return <div>{selectedComponent?.text}</div>;
}
