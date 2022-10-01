import { useEffect, useState } from "react";
import styled from "styled-components";
import { Coord } from "./common/types";
import { clamp, cumulative } from "./common/functions/math";

interface FractionSlidersProps {
  axis: "vertical" | "horizontal";
  width: number;
  height: number;
  fractions: number[];
  onChange: (fractions: number[]) => void;
}

/**
 * Controlled input for redistributing the total quantity between two or more fractions.
 */
export default function FractionSliders({
  axis,
  width,
  height,
  fractions,
  onChange,
}: FractionSlidersProps) {
  const [dragStart, setDragStart] = useState<DragStart | null>(null);

  const isHorizontal = axis === "horizontal";
  const isDragging = dragStart !== null;
  const finishDragging = () => setDragStart(null);

  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e: PointerEvent) => {
      const diff = isHorizontal
        ? (dragStart.pointerDownCoord.x - e.clientX) / width
        : (dragStart.pointerDownCoord.y - e.clientY) / height;
      onChange(shiftedToNext(fractions, dragStart.handleIndex, diff));
    };

    const onPointerUp = (e: PointerEvent) => finishDragging();

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging]);

  const Handle = isHorizontal ? VerticalHandle : HorizontalHandle;

  return (
    <Container style={{ width, height }}>
      {cumulative(fractions)
        .slice(0, -1)
        .map((fr, idx) => (
          <Handle
            key={idx}
            style={{ [isHorizontal ? "left" : "top"]: `${fr * 100}%` }}
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
  position: relative;
  pointer-events: none;
`;

const Handle = styled.div`
  pointer-events: auto;
  position: absolute;
`;

const VerticalHandle = styled(Handle)`
  width: 10px;
  height: 100%;
  transform: translateX(-50%);

  &:hover {
    cursor: ew-resize;
  }
`;

const HorizontalHandle = styled(Handle)`
  height: 10px;
  width: 100%;
  transform: translateY(-50%);

  &:hover {
    cursor: ns-resize;
  }
`;
