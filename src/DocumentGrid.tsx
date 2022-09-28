import jsPDF from "jspdf";
import { useState } from "react";
import styled from "styled-components";
import { withInsertedAt } from "./common/array";
import { cumulative } from "./common/math";
import { withInsertedColumn } from "./common/matrix";
import FractionSliders from "./FractionSliders";

// A4 dimensions (width, height) in points.
const a4Dimensions: [number, number] = [595.28, 842.89];

const scale = 1;
const documentWidth = a4Dimensions[0] * scale;
const documentHeight = a4Dimensions[1] * scale;

const colors = [
  "#000000",
  "#ffffff",
  "#ef5350",
  "#ec407a",
  "#ab47bc",
  "#7e57c2",
  "#5c6bc0",
  "#42a5f5",
  "#29b6f6",
  "#26c6da",
  "#26a69a",
];

export default function DocumentGrid({}) {
  const [cols, setCols] = useState([0.5, 0.5]);
  const [rows, setRows] = useState([0.5, 0.5]);
  const [colorMat, setColorMat] = useState<number[][]>([
    [0, 1],
    [2, 7],
  ]);

  const cells = [];

  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < cols.length; c++) {
      const colorIdx = colorMat[r][c];
      const color = colors[colorIdx];

      cells.push(
        <Cell
          style={{ backgroundColor: color }}
          onClick={() => {
            const newColorIndices = colorMat.map((row) => row.slice());
            newColorIndices[r][c] = (colorIdx + 1) % colors.length;
            setColorMat(newColorIndices);
          }}
        />
      );
    }
  }

  const insertColumnAt = (index: number, fillColor: number = 0): void => {
    const newColFr = 1 / (cols.length + 1);
    const scalar = 1 - newColFr;
    const squeezedCols = cols.map((fr) => fr * scalar);

    const newCols = withInsertedAt(squeezedCols, index, newColFr);
    const newColorMat = withInsertedColumn(colorMat, index, fillColor);

    setCols(newCols);
    setColorMat(newColorMat);
  };

  return (
    <div style={{ textAlign: "center", padding: "32px" }}>
      <button onClick={() => insertColumnAt(0)}>Add column</button>

      <StackRoot
        style={{
          width: documentWidth,
          height: documentHeight,
        }}
      >
        <div
          style={{
            width: documentWidth,
            height: documentHeight,
            backgroundColor: "white",
            display: "grid",
            gridTemplateColumns: cols.map((fr) => fr * 100 + "%").join(" "),
            gridTemplateRows: rows.map((fr) => fr * 100 + "%").join(" "),
          }}
        >
          {cells}
        </div>

        <FractionSliders
          axis="vertical"
          width={documentWidth}
          height={documentHeight}
          fractions={rows}
          onChange={(fractions) => setRows(fractions)}
        />

        <FractionSliders
          axis="horizontal"
          width={documentWidth}
          height={documentHeight}
          fractions={cols}
          onChange={(fractions) => setCols(fractions)}
        />
      </StackRoot>

      <button
        onClick={(e) => {
          // Default export is a4 paper, portrait, using millimeters for units
          const doc = new jsPDF({
            unit: "pt",
          });

          const absCols = cols.map((fr) => fr * documentWidth);
          const absRows = rows.map((fr) => fr * documentHeight);
          const colRights = cumulative(absCols);
          const rowBottoms = cumulative(absRows);

          for (let r = 0; r < absRows.length; r++) {
            for (let c = 0; c < absCols.length; c++) {
              const color = colors[colorMat[r][c]];
              const width = absCols[c];
              const height = absRows[r];
              const x = colRights[c] - width;
              const y = rowBottoms[r] - height;

              doc.setFillColor(color);
              doc.rect(x, y, width, height, "F");
            }
          }

          doc.save("a4.pdf");
        }}
      >
        Save as PDF
      </button>
    </div>
  );
}

const Cell = styled.div`
  outline: 1px solid black;
`;

const StackRoot = styled.div`
  margin: 20px auto;
  position: relative;

  & > * {
    position: absolute;
  }
`;
