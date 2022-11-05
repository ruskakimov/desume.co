import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { a4SizeInPoints } from "../common/constants/sizes";
import { setPageMargins } from "../features/document/documentSlice";
import FractionSliders from "./FractionSliders";
import Page from "./Page";

const scale = 1;
const documentWidth = a4SizeInPoints.width * scale;
const documentHeight = a4SizeInPoints.height * scale;

export default function DocumentArea() {
  const docComponents = useSelector(
    (state: RootState) => state.document.components
  );

  return (
    <DocumentAreaShell>
      <Page pageWidth={documentWidth} pageHeight={documentHeight}>
        {docComponents.map((component, index) => (
          <h1 key={index}>{component.text}</h1>
        ))}
      </Page>
    </DocumentAreaShell>
  );
}

function DocumentAreaShell(props: { children: React.ReactNode }) {
  const pageMargins = useSelector(
    (state: RootState) => state.document.pageMargins
  );
  const dispatch = useDispatch();

  const { left, right } = pageMargins;

  return (
    <div className="h-full w-full relative">
      <div className="max-h-full overflow-scroll">
        <div className="py-32">{props.children}</div>
      </div>

      <div className="h-full absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
        <FractionSliders
          axis="horizontal"
          width={documentWidth}
          fractions={[left, 1 - left - right, right]}
          onChange={(fractions) =>
            dispatch(
              setPageMargins({
                ...pageMargins,
                left: fractions[0],
                right: fractions[2],
              })
            )
          }
        />
      </div>
    </div>
  );
}
