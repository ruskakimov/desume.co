import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { a4SizeInPoints } from "../common/constants/sizes";
import { setPageMargins } from "../features/document/documentSlice";
import FractionSliders from "./FractionSliders";

const scale = 1;
const documentWidth = a4SizeInPoints.width * scale;
const documentHeight = a4SizeInPoints.height * scale;

export default function DocumentGrid({}) {
  const pageMargins = useSelector(
    (state: RootState) => state.document.pageMargins
  );
  const dispatch = useDispatch();

  const { top, left, right, bottom } = pageMargins;
  const colTemplate = `${left * 100}% 1fr ${right * 100}%`;
  const rowTemplate = `${top * 100}% 1fr ${bottom * 100}%`;

  return (
    <div className="h-full w-full relative">
      <div className="max-h-full overflow-scroll">
        <div className="py-32">
          <div className="relative">
            <div
              className="mx-auto bg-white outline outline-1 outline-gray-3"
              style={{
                width: documentWidth,
                height: documentHeight,
                display: "grid",
                gridTemplateColumns: colTemplate,
                gridTemplateRows: rowTemplate,
              }}
            ></div>

            <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
              <FractionSliders
                axis="vertical"
                height={documentHeight}
                fractions={[top, 1 - top - bottom, bottom]}
                onChange={(fractions) =>
                  dispatch(
                    setPageMargins({
                      ...pageMargins,
                      top: fractions[0],
                      bottom: fractions[2],
                    })
                  )
                }
              />
            </div>
          </div>
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
