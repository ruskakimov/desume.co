import React from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { a4SizeInPoints } from "../common/constants/sizes";
import { setPageMargins } from "../features/document/documentSlice";
import defaultStyles from "./defaultStyles";
import FractionSliders from "./FractionSliders";
import Page from "./Page";

const scale = 1;
const documentWidth = a4SizeInPoints.width * scale;
const documentHeight = a4SizeInPoints.height * scale;

export default function DocumentPreview() {
  const content = useSelector((state: RootState) => state.document.content);

  return (
    <DocumentAreaShell>
      <Page pageWidth={documentWidth} pageHeight={documentHeight}>
        <ReactMarkdown
          className="prose"
          children={content}
          components={
            {
              // h1: (props) => <h1 style={defaultStyles.h1} {...props} />,
              // h2: (props) => <h2 style={defaultStyles.h2} {...props} />,
              // h3: (props) => <h3 style={defaultStyles.h3} {...props} />,
              // h4: (props) => <h4 style={defaultStyles.h4} {...props} />,
              // h5: (props) => <h5 style={defaultStyles.h5} {...props} />,
              // h6: (props) => <h6 style={defaultStyles.h6} {...props} />,
              // p: (props) => <p style={defaultStyles.p} {...props} />,
            }
          }
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
        <div className="py-8">{children}</div>
      </div>
    </div>
  );
}
