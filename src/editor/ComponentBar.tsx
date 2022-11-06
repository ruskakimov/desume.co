import { useDispatch } from "react-redux";
import MarkdownArea from "./MarkdownArea";
import Tabs from "./Tabs";

export default function ComponentBar() {
  const dispatch = useDispatch();

  return (
    <>
      <Tabs />
      <MarkdownArea />
    </>
  );
}
