import React from "react";
import ReactMarkdown from "react-markdown";
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
  const content = useSelector((state: RootState) => state.document.content);

  return (
    <DocumentAreaShell>
      <Page pageWidth={documentWidth} pageHeight={documentHeight}>
        <ReactMarkdown
          children={content}
          components={{
            h1: (props) => (
              <h1
                style={{ fontSize: 32, color: "red", marginBottom: 16 }}
                {...props}
              ></h1>
            ),
            p: (props) => (
              <p style={{ fontSize: 14, marginBottom: 16 }} {...props}></p>
            ),
          }}
        />
      </Page>
    </DocumentAreaShell>
  );
}

interface DocumentAreaShellProps
  extends React.BaseHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function DocumentAreaShell({ children, ...props }: DocumentAreaShellProps) {
  const pageMargins = useSelector(
    (state: RootState) => state.document.pageMargins
  );
  const dispatch = useDispatch();

  const { left, right } = pageMargins;

  return (
    <div {...props} className="h-full w-full relative">
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

      <div className="max-h-full overflow-scroll">
        <div className="py-32">{children}</div>
      </div>
    </div>
  );
}
