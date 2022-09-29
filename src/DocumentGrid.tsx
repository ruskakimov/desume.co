import jsPDF from "jspdf";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { withInsertedAt } from "./common/array";
import { cumulative } from "./common/math";
import { withInsertedColumn, withInsertedRow } from "./common/matrix";
import { Coord } from "./common/types";
import FractionSliders from "./FractionSliders";

// A4 dimensions (width, height) in points.
const a4Dimensions: [number, number] = [595.28, 842.89];

const scale = 1;
const documentWidth = a4Dimensions[0] * scale;
const documentHeight = a4Dimensions[1] * scale;

interface ContextMenu {
  topLeft: Coord;
}

export default function DocumentGrid({}) {
  const [colSizes, setColSizes] = useState([0.5, 0.5]);
  const [rowSizes, setRowSizes] = useState([0.5, 0.5]);
  const [contentMat, setContentMat] = useState<string[][]>([
    ["", "# Hello"],
    ["", "world"],
  ]);

  const [contextMenu, setContextMenu] = useState<ContextMenu>();

  const cells = [];

  for (let r = 0; r < rowSizes.length; r++) {
    for (let c = 0; c < colSizes.length; c++) {
      const content = contentMat[r][c];
      // TODO: Select cell and modify its content
      cells.push(
        <Cell>
          <ReactMarkdown children={content} />
        </Cell>
      );
    }
  }

  const insertColumnAt = (index: number): void => {
    const newColFr = 1 / (colSizes.length + 1);
    const scalar = 1 - newColFr;
    const squeezedCols = colSizes.map((fr) => fr * scalar);

    const newColSizes = withInsertedAt(squeezedCols, index, newColFr);
    const newColorMat = withInsertedColumn(contentMat, index, "");

    setColSizes(newColSizes);
    setContentMat(newColorMat);
  };

  const insertRowAt = (index: number): void => {
    const newRowFr = 1 / (rowSizes.length + 1);
    const scalar = 1 - newRowFr;
    const squeezedRows = rowSizes.map((fr) => fr * scalar);

    const newRowSizes = withInsertedAt(squeezedRows, index, newRowFr);
    const newColorMat = withInsertedRow(contentMat, index, "");

    setRowSizes(newRowSizes);
    setContentMat(newColorMat);
  };

  return (
    <div
      style={{ textAlign: "center", padding: "32px" }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({
          topLeft: {
            x: e.clientX,
            y: e.clientY,
          },
        });
      }}
    >
      <button onClick={() => insertColumnAt(0)}>Add column</button>

      <button onClick={() => insertRowAt(0)}>Add row</button>

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
            gridTemplateColumns: colSizes.map((fr) => fr * 100 + "%").join(" "),
            gridTemplateRows: rowSizes.map((fr) => fr * 100 + "%").join(" "),
          }}
        >
          {cells}
        </div>

        <FractionSliders
          axis="vertical"
          width={documentWidth}
          height={documentHeight}
          fractions={rowSizes}
          onChange={(fractions) => setRowSizes(fractions)}
        />

        <FractionSliders
          axis="horizontal"
          width={documentWidth}
          height={documentHeight}
          fractions={colSizes}
          onChange={(fractions) => setColSizes(fractions)}
        />
      </StackRoot>

      <button
        onClick={(e) => {
          // Default export is a4 paper, portrait, using millimeters for units
          const doc = new jsPDF({
            unit: "pt",
          });

          const absCols = colSizes.map((fr) => fr * documentWidth);
          const absRows = rowSizes.map((fr) => fr * documentHeight);
          const colRights = cumulative(absCols);
          const rowBottoms = cumulative(absRows);

          for (let r = 0; r < absRows.length; r++) {
            for (let c = 0; c < absCols.length; c++) {
              // const color = colors[contentMat[r][c]];
              const width = absCols[c];
              const height = absRows[r];
              const x = colRights[c] - width;
              const y = rowBottoms[r] - height;

              // doc.setFillColor(color);
              doc.rect(x, y, width, height, "F");
            }
          }

          // TODO: Generate PDF page from HTML element (draw headers and paragraphs)

          doc.save("a4.pdf");
        }}
      >
        Save as PDF
      </button>

      {contextMenu && (
        <ContextMenu
          style={{ top: contextMenu.topLeft.y, left: contextMenu.topLeft.x }}
        >
          <ContextMenuItem>Add row before</ContextMenuItem>
          <ContextMenuItem>Add row after</ContextMenuItem>
          <ContextMenuItem>Add column before</ContextMenuItem>
          <ContextMenuItem>Add column after</ContextMenuItem>
        </ContextMenu>
      )}
    </div>
  );
}

const Cell = styled.div`
  outline: 1px solid black;
  text-align: left;
`;

const StackRoot = styled.div`
  margin: 20px auto;
  position: relative;

  & > * {
    position: absolute;
  }
`;

const ContextMenu = styled.div`
  width: 20rem;
  background-color: white;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const ContextMenuItem = styled.button`
  display: block;
  width: 100%;
  border: none;
  background-color: initial;

  padding: 1em;
  font-size: 14px;
  text-align: left;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
