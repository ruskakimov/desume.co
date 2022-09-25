import jsPDF from "jspdf";
import { useState } from "react";
import styled from "styled-components";
import FractionSliders from "./FractionSliders";

// A4 dimensions (width, height) in points.
const a4Dimensions: [number, number] = [595.28, 842.89];

const scale = 1;
const documentWidth = a4Dimensions[0] * scale;
const documentHeight = a4Dimensions[1] * scale;

function giveToNext(array: number[], index: number, amount: number): number[] {
  const copy = array.slice();
  copy[index] -= amount;
  copy[index + 1] += amount;
  return copy;
}

export default function DocumentGrid({}) {
  // width of each column in pixels (just for the sake of the demo)
  const [cols, setCols] = useState([0.5, 0.5]);
  const [rows, setRows] = useState([documentHeight / 2, documentHeight / 2]);
  const [colors, setColors] = useState([
    "#ff0000",
    "#000000",
    "#000000",
    "#ff0000",
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

  const moveVerticalBorderToLeftBy = (amount: number) => {
    setCols(giveToNext(cols, 0, amount));
    console.log(giveToNext(cols, 0, amount));
  };

  const moveHorizontalBorderToLeftBy = (amount: number) => {
    setRows(giveToNext(rows, 0, amount));
  };

  return (
    <Container>
      <p>
        <b>Columns:</b>
        {cols.map((width) => (
          <input value={width} />
        ))}
        <button onClick={() => moveVerticalBorderToLeftBy(10)}>{"<-"}</button>
        <button onClick={() => moveVerticalBorderToLeftBy(-10)}>{"->"}</button>
      </p>

      <p>
        <b>Rows:</b>
        {rows.map((height) => (
          <input value={height} />
        ))}
        <button onClick={() => moveHorizontalBorderToLeftBy(10)}>{"☝️"}</button>
        <button onClick={() => moveHorizontalBorderToLeftBy(-10)}>
          {"👇"}
        </button>
      </p>

      <FractionSliders
        width={documentWidth}
        fractions={cols}
        onChange={(fractions) => setCols(fractions)}
      />

      <div
        style={{
          width: documentWidth,
          height: documentHeight,
          backgroundColor: "white",
          margin: "20px auto",
          display: "grid",
          gridTemplateColumns: cols.map((w) => w * 100 + "%").join(" "),
          gridTemplateRows: rows.map((w) => w + "px").join(" "),
        }}
      >
        {cells}
      </div>

      <button
        onClick={(e) => {
          // Default export is a4 paper, portrait, using millimeters for units
          const doc = new jsPDF({
            unit: "pt",
          });

          for (let r = 0; r < rows.length; r++) {
            for (let c = 0; c < cols.length; c++) {
              const i = r * cols.length + c;
              const color = colors[i];
              const width = cols[c];
              const height = rows[r];
              const x = cols.slice(0, c).reduce((a, b) => a + b, 0);
              const y = rows.slice(0, r).reduce((a, b) => a + b, 0);

              doc.setFillColor(color);
              doc.rect(x, y, width, height, "F");
            }
          }

          doc.save("a4.pdf");
        }}
      >
        Save as PDF
      </button>
    </Container>
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

const Container = styled.div`
  text-align: center;
`;
