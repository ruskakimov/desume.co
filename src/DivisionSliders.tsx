import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

// TODO: Move internal state to props
// TODO: Make props required
interface DivisionSlidersProps {
  divisions?: number[];
  onChange?: (changedDivisions: number[]) => void;
}

interface Coord {
  x: number;
  y: number;
}

/**
 * Controlled input for redistributing the total quantity between two or more divisions.
 */
export default function DivisionSliders({}: DivisionSlidersProps) {
  const [pointerDownCoord, setPointerDownCoord] = useState<Coord | null>(null);

  const isDragging = pointerDownCoord !== null;
  const finishDragging = () => setPointerDownCoord(null);

  useEffect(() => {
    if (!isDragging) return;

    console.log("dragging!");

    const onPointerMove = (e: PointerEvent) => {
      console.log(e.clientX - pointerDownCoord.x);
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
`;

const Handle = styled.div`
  width: 10px;
  height: 100%;
  background-color: blue;

  &:hover {
    cursor: ew-resize;
  }
`;
