import jsPDF from "jspdf";
import { useState } from "react";
import styled from "styled-components";
import FractionSliders from "./FractionSliders";

// A4 dimensions (width, height) in points.
const a4Dimensions: [number, number] = [595.28, 842.89];

const scale = 1;
const documentWidth = a4Dimensions[0] * scale;
const documentHeight = a4Dimensions[1] * scale;

export default function DocumentGrid({}) {
  const [cols, setCols] = useState([0.5, 0.3, 0.2]);
  const [rows, setRows] = useState([0.3, 0.5, 0.2]);
  const [colors, setColors] = useState([
    "#ef5350",
    "#ec407a",
    "#ab47bc",
    "#7e57c2",
    "#5c6bc0",
    "#42a5f5",
    "#29b6f6",
    "#26c6da",
    "#26a69a",
  ]);

  const cells = [];

  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < cols.length; c++) {
      const i = r * cols.length + c;
      cells.push(
        <ColorBlock
          color={colors[i]}
          onChanged={(color) => {
            const newColors = colors.slice();
            newColors[i] = color;
            setColors(newColors);
          }}
        />
      );
    }
  }

  return (
    <>
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
          width={documentWidth}
          fractions={cols}
          onChange={(fractions) => setCols(fractions)}
        />

        {/* <FractionSliders
          width={documentWidth}
          fractions={rows}
          onChange={(fractions) => setRows(fractions)}
        /> */}
      </StackRoot>

      <button
        onClick={(e) => {
          // Default export is a4 paper, portrait, using millimeters for units
          const doc = new jsPDF({
            unit: "pt",
          });

          const absCols = cols.map((fr) => fr * documentWidth);
          const absRows = rows.map((fr) => fr * documentHeight);

          for (let r = 0; r < absRows.length; r++) {
            for (let c = 0; c < absCols.length; c++) {
              const i = r * absCols.length + c;
              const color = colors[i];
              const width = absCols[c];
              const height = absRows[r];
              const x = absCols.slice(0, c).reduce((a, b) => a + b, 0);
              const y = absRows.slice(0, r).reduce((a, b) => a + b, 0);

              doc.setFillColor(color);
              doc.rect(x, y, width, height, "F");
            }
          }

          doc.save("a4.pdf");
        }}
      >
        Save as PDF
      </button>
    </>
  );
}

interface ColorBlockProps {
  color: string;
  onChanged?: (color: string) => void;
}

function ColorBlock({ color, onChanged }: ColorBlockProps) {
  return (
    <div
      style={{
        outline: "1px solid black",
        backgroundColor: color,
      }}
    >
      <input
        type="color"
        value={color}
        onChange={(e) => onChanged?.call(null, e.target.value)}
      />
    </div>
  );
}

const StackRoot = styled.div`
  margin: 20px auto;
  position: relative;

  & > * {
    position: absolute;
  }
`;
