import { useEffect, useState } from "react";
import styled from "styled-components";

// TODO: Move internal state to props
// TODO: Make props required
interface FractionSlidersProps {
  fractions?: number[];
  onChange?: (fractions: number[]) => void;
}

interface Coord {
  x: number;
  y: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function giveToNext(array: number[], index: number, amount: number): number[] {
  const copy = array.slice();
  copy[index] -= amount;
  copy[index + 1] += amount;
  return copy;
}

interface DragStart {
  pointerDownCoord: Coord;
  handleIndex: number;
}

/**
 * Controlled input for redistributing the total quantity between two or more fractions.
 */
export default function FractionSliders({}: FractionSlidersProps) {
  const [dragStart, setDragStart] = useState<DragStart | null>(null);

  const [fractions, setFractions] = useState<number[]>([0.2, 0.3, 0.5]);

  const width = 400;

  const isDragging = dragStart !== null;
  const finishDragging = () => setDragStart(null);

  useEffect(() => {
    if (!isDragging) return;

    console.log("dragging!");

    const onPointerMove = (e: PointerEvent) => {
      const absDiff = e.clientX - dragStart.pointerDownCoord.x;
      const fractionIdx = dragStart.handleIndex;
      const fractionDiff = clamp(
        absDiff / width,
        -fractions[fractionIdx], // max give
        fractions[fractionIdx + 1] // max take
      );
      setFractions(giveToNext(fractions, fractionIdx, -fractionDiff));
    };
    const onPointerUp = (e: PointerEvent) => finishDragging();

    console.log("attached listeners");
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      console.log("removed listeners");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging]);

  const handPositions = [];
  let leftOffset = 0;

  for (let fr of fractions.slice(0, -1)) {
    leftOffset += fr;
    handPositions.push(leftOffset);
  }

  return (
    <>
      <p>{fractions.map((fr) => fr.toFixed(2)).join(", ")}</p>
      <Container style={{ width }}>
        {handPositions.map((leftPerc, idx) => (
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
