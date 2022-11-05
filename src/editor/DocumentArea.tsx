import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { a4SizeInPoints } from "../common/constants/sizes";
import { setPageMargins } from "../features/document/documentSlice";
import FractionSliders from "./FractionSliders";
import Page from "./Page";

const scale = 1;
const documentWidth = a4SizeInPoints.width * scale;
const documentHeight = a4SizeInPoints.height * scale;

export default function DocumentArea({}) {
  const pageMargins = useSelector(
    (state: RootState) => state.document.pageMargins
  );
  const dispatch = useDispatch();

  const { left, right } = pageMargins;

  return (
    <div className="h-full w-full relative">
      <div className="max-h-full overflow-scroll">
        <div className="py-32">
          <Page pageWidth={documentWidth} pageHeight={documentHeight} />
        </div>
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
