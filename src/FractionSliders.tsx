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

/**
 * Controlled input for redistributing the total quantity between two or more fractions.
 */
export default function FractionSliders({}: FractionSlidersProps) {
  const [pointerDownCoord, setPointerDownCoord] = useState<Coord | null>(null);
  const [firstWidth, setFirstWidth] = useState<number>(0);

  const isDragging = pointerDownCoord !== null;
  const finishDragging = () => setPointerDownCoord(null);

  useEffect(() => {
    if (!isDragging) return;

    console.log("dragging!");

    const onPointerMove = (e: PointerEvent) => {
      const dragDiff = e.clientX - pointerDownCoord.x;
      const newFirstWidth = Math.max(0, firstWidth + dragDiff);
      setFirstWidth(newFirstWidth);
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
    <Container>
      <Handle
        style={{ left: firstWidth }}
        onPointerDown={(e) =>
          setPointerDownCoord({ x: e.clientX, y: e.clientY })
        }
        draggable={false}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 400px;
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

  &:hover {
    cursor: ew-resize;
  }
`;
