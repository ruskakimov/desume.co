import { useEffect, useState } from "react";
import styled from "styled-components";
import { Coord } from "./common/types";
import { clamp, cumulative } from "./common/math";

interface FractionSlidersProps {
  width: number;
  fractions: number[];
  onChange: (fractions: number[]) => void;
}

/**
 * Controlled input for redistributing the total quantity between two or more fractions.
 */
export default function FractionSliders({
  width,
  fractions,
  onChange,
}: FractionSlidersProps) {
  const [dragStart, setDragStart] = useState<DragStart | null>(null);

  const isDragging = dragStart !== null;
  const finishDragging = () => setDragStart(null);

  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e: PointerEvent) => {
      const absDiff = dragStart.pointerDownCoord.x - e.clientX;
      const fractionIdx = dragStart.handleIndex;
      const fractionDiff = absDiff / width;
      onChange(shiftedToNext(fractions, fractionIdx, fractionDiff));
    };

    const onPointerUp = (e: PointerEvent) => finishDragging();

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging]);

  return (
    <>
      <p>{fractions.map((fr) => fr.toFixed(2)).join(", ")}</p>
      <Container style={{ width }}>
        {cumulative(fractions)
          .slice(0, -1)
          .map((leftPerc, idx) => (
            <Handle
              key={idx}
              style={{ left: `${leftPerc * 100}%` }}
              onPointerDown={(e) =>
                setDragStart({
                  pointerDownCoord: { x: e.clientX, y: e.clientY },
                  handleIndex: idx,
                })
              }
              draggable={false} // prevent default dnd behaviour
            />
          ))}
      </Container>
    </>
  );
}

interface DragStart {
  pointerDownCoord: Coord;
  handleIndex: number;
}

function shiftedToNext(
  array: number[],
  index: number,
  amount: number
): number[] {
  // Prevent negative values in array.
  const maxGive = array[index];
  const maxTake = array[index + 1];
  amount = clamp(amount, -maxTake, maxGive);

  const copy = array.slice();
  copy[index] -= amount;
  copy[index + 1] += amount;
  return copy;
}

const Container = styled.div`
  height: 100px;
  margin: 0 auto;
  outline: 1px solid black;
  position: relative;
`;

const Handle = styled.div`
  width: 10px;
  height: 100%;
  background-color: blue;
  position: absolute;
  transform: translateX(-50%);

  &:hover {
    cursor: ew-resize;
  }
`;