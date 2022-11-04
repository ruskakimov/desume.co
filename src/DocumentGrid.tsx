import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { withInsertedAt } from "./common/functions/array";
import {
  CellCoord,
  withChangedCell,
  withInsertedColumn,
  withInsertedRow,
} from "./common/functions/matrix";
import { a4SizeInPoints } from "./common/constants/sizes";
import { Coord } from "./common/types";
import FractionSliders from "./FractionSliders";
import { generatePdfFromHtml } from "./pdf/generatePdfFromHtml";

const scale = 1;
const documentWidth = a4SizeInPoints.width * scale;
const documentHeight = a4SizeInPoints.height * scale;

interface ContextMenu {
  topLeft: Coord;
  columnIndex: number;
  rowIndex: number;
}

const initialSelectedCell: CellCoord = {
  rowIndex: 0,
  colIndex: 1,
};

const sampleRichText = `
### Features

Some text should be **bold** and other text can be *italic*. Plus this long long long long text is positioned correctly.
`;

const sampleHeader = `
# Hello
`;

const sampleList = `
- • Hello
- • World
- • Again
- • Deleted every junk file
- • Searched every nook and cranny
`;

const sampleParagraph = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. In imperdiet nibh purus, a pharetra arcu pharetra vel. Mauris sit amet erat volutpat, scelerisque augue ac, tincidunt urna. Nunc quis vestibulum arcu. Nunc nec posuere dolor. Cras sed porttitor mauris. Nulla rhoncus dui quis purus iaculis eleifend. Donec rutrum enim sed nisl euismod, quis ornare felis malesuada. Curabitur blandit turpis ac orci ultrices semper. Integer placerat suscipit ipsum, a pulvinar massa efficitur nec. In ligula sem, tristique quis interdum sit amet, eleifend vitae est. Cras sodales gravida libero nec vulputate.
`;

export default function DocumentGrid({}) {
  const [colSizes, setColSizes] = useState([0.5, 0.5]);
  const [rowSizes, setRowSizes] = useState([0.5, 0.5]);
  const [contentMat, setContentMat] = useState<string[][]>([
    [sampleRichText, sampleHeader],
    [sampleList, sampleParagraph],
  ]);

  const [selectedCell, setSelectedCell] =
    useState<CellCoord>(initialSelectedCell);

  const updateSelectedCellContent = (content: string) => {
    const newContentMat = withChangedCell(contentMat, selectedCell, content);
    setContentMat(newContentMat);
  };

  const [contextMenu, setContextMenu] = useState<ContextMenu>();
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contextMenu) return;

    const onPointerDown = (e: PointerEvent) => {
      const isInside = contextMenuRef.current!.contains(
        e.target as Node | null
      );
      if (!isInside) setContextMenu(undefined);
    };

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [contextMenu]);

  const cells = [];

  for (let r = 0; r < rowSizes.length; r++) {
    for (let c = 0; c < colSizes.length; c++) {
      const content = contentMat[r][c];
      const isSelected =
        selectedCell.rowIndex === r && selectedCell.colIndex === c;

      cells.push(
        <Cell
          style={{
            outline: isSelected ? "2px solid blue" : undefined,
          }}
          onClick={(e) => {
            setSelectedCell({ rowIndex: r, colIndex: c });
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenu({
              topLeft: {
                x: e.clientX,
                y: e.clientY,
              },
              columnIndex: c,
              rowIndex: r,
            });
          }}
        >
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
    const newColorMat = withInsertedColumn(contentMat, index, "test");

    setColSizes(newColSizes);
    setContentMat(newColorMat);
  };

  const insertRowAt = (index: number): void => {
    const newRowFr = 1 / (rowSizes.length + 1);
    const scalar = 1 - newRowFr;
    const squeezedRows = rowSizes.map((fr) => fr * scalar);

    const newRowSizes = withInsertedAt(squeezedRows, index, newRowFr);
    const newColorMat = withInsertedRow(contentMat, index, "test");

    setRowSizes(newRowSizes);
    setContentMat(newColorMat);
  };

  const selectedCellContent =
    contentMat[selectedCell.rowIndex][selectedCell.colIndex];

  return (
    <div style={{ textAlign: "center", padding: "32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 20,
          alignItems: "stretch",
        }}
      >
        <StackRoot
          style={{
            width: documentWidth,
            height: documentHeight,
          }}
        >
          <div
            ref={rootRef}
            style={{
              width: documentWidth,
              height: documentHeight,
              backgroundColor: "white",
              display: "grid",
              gridTemplateColumns: colSizes
                .map((fr) => fr * 100 + "%")
                .join(" "),
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

        {/* <textarea
          style={{
            marginLeft: 40,
            width: 400,
          }}
          value={selectedCellContent}
          onChange={(e) => updateSelectedCellContent(e.target.value)}
        /> */}
      </div>

      {/* <button
        onClick={() => {
          if (rootRef.current) {
            generatePdfFromHtml(rootRef.current).save();
          }
        }}
      >
        Save as PDF
      </button> */}

      {contextMenu && (
        <ContextMenu
          ref={contextMenuRef}
          style={{ top: contextMenu.topLeft.y, left: contextMenu.topLeft.x }}
        >
          <ContextMenuItem
            onClick={() => {
              insertRowAt(contextMenu.rowIndex);
              setContextMenu(undefined);
            }}
          >
            Add row before
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              insertRowAt(contextMenu.rowIndex + 1);
              setContextMenu(undefined);
            }}
          >
            Add row after
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem
            onClick={() => {
              insertColumnAt(contextMenu.columnIndex);
              setContextMenu(undefined);
            }}
          >
            Add column before
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              insertColumnAt(contextMenu.columnIndex + 1);
              setContextMenu(undefined);
            }}
          >
            Add column after
          </ContextMenuItem>
        </ContextMenu>
      )}
    </div>
  );
}

const Cell = styled.div`
  outline: 1px solid black;
  text-align: left;
  user-select: none;

  & > * {
    margin: 0;
    font-family: "times";
    line-height: 1.5;
  }

  & > h1 {
    font-size: 64px;
  }

  li::marker {
    content: "";
  }
`;

const StackRoot = styled.div`
  position: relative;

  & > * {
    position: absolute;
  }
`;

const ContextMenu = styled.div`
  width: 15rem;
  background-color: #fafafa;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  padding: 8px 0;
`;

const ContextMenuItem = styled.button`
  display: block;
  width: 100%;
  border: none;
  background-color: initial;

  padding: 0.4em 1.2em;
  font-size: 14px;
  text-align: left;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }
`;

const ContextMenuSeparator = styled.hr`
  margin: 8px 0;
  border: 0.5px solid rgba(0, 0, 0, 0.1);
`;
