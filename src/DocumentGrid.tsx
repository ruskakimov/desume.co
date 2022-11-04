import { useState } from "react";
import { a4SizeInPoints } from "./common/constants/sizes";
import FractionSliders from "./FractionSliders";

const scale = 1;
const documentWidth = a4SizeInPoints.width * scale;
const documentHeight = a4SizeInPoints.height * scale;

export default function DocumentGrid({}) {
  const [colSizes, setColSizes] = useState([0.1, 0.8, 0.1]);
  const [rowSizes, setRowSizes] = useState([0.1, 0.8, 0.1]);

  return (
    <div className="h-full relative">
      <div className="py-16">
        <div className="relative">
          <div
            className="mx-auto bg-white outline outline-1 outline-gray-3"
            style={{
              width: documentWidth,
              height: documentHeight,
              display: "grid",
              gridTemplateColumns: colSizes
                .map((fr) => fr * 100 + "%")
                .join(" "),
              gridTemplateRows: rowSizes.map((fr) => fr * 100 + "%").join(" "),
            }}
          ></div>

          <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
            <FractionSliders
              axis="vertical"
              height={documentHeight}
              fractions={rowSizes}
              onChange={(fractions) => setRowSizes(fractions)}
            />
          </div>
        </div>
      </div>

      <div className="h-full absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
        <FractionSliders
          axis="horizontal"
          width={documentWidth}
          fractions={colSizes}
          onChange={(fractions) => setColSizes(fractions)}
        />
      </div>
    </div>
  );
}
