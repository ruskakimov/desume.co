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

/**
 * Controlled input for redistributing the total quantity between two or more fractions.
 */
export default function FractionSliders({}: FractionSlidersProps) {
  const [pointerDownCoord, setPointerDownCoord] = useState<Coord | null>(null);

  // TODO: Implement behaviour for 3 fractions (2 sliders)
  const [fractions, setFractions] = useState<number[]>([0.5, 0.5]);

  const width = 400;

  const isDragging = pointerDownCoord !== null;
  const finishDragging = () => setPointerDownCoord(null);

  useEffect(() => {
    if (!isDragging) return;

    console.log("dragging!");

    const onPointerMove = (e: PointerEvent) => {
      const absDiff = e.clientX - pointerDownCoord.x;
      const fractionDiff = clamp(absDiff / width, -fractions[0], fractions[1]);
      setFractions(giveToNext(fractions, 0, -fractionDiff));
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

  return (
    <Container style={{ width }}>
      <Handle
        style={{ left: `${fractions[0] * 100}%` }}
        onPointerDown={(e) =>
          setPointerDownCoord({ x: e.clientX, y: e.clientY })
        }
        draggable={false}
      />
    </Container>
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
