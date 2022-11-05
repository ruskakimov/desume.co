import { useEffect, useState } from "react";
import { Coord } from "./common/types";
import { clamp, cumulative } from "./common/functions/math";

interface FractionSlidersProps {
  axis: "vertical" | "horizontal";
  width?: number;
  height?: number;
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
  if (axis === "vertical" && height === undefined) throw Error();
  if (axis === "horizontal" && width === undefined) throw Error();

  const [dragStart, setDragStart] = useState<DragStart | null>(null);

  const isHorizontal = axis === "horizontal";
  const isDragging = dragStart !== null;
  const finishDragging = () => setDragStart(null);

  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e: PointerEvent) => {
      const diff = isHorizontal
        ? (dragStart.pointerDownCoord.x - e.clientX) / width!
        : (dragStart.pointerDownCoord.y - e.clientY) / height!;
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

  const handleClass = isHorizontal
    ? "group pointer-events-auto absolute w-3 h-full -translate-x-1/2 hover:cursor-ew-resize flex justify-center"
    : "group pointer-events-auto absolute h-3 w-full -translate-y-1/2 hover:cursor-ns-resize flex items-center";

  const line = isHorizontal ? (
    <div className="w-px h-full bg-gray-3 group-hover:bg-blue transition-colors" />
  ) : (
    <div className="h-px w-full bg-gray-3 group-hover:bg-blue transition-colors" />
  );

  return (
    <div
      className="relative pointer-events-none"
      style={{ width: width ?? "100%", height: height ?? "100%" }}
    >
      {cumulative(fractions)
        .slice(0, -1)
        .map((fr, idx) => (
          <div
            className={handleClass}
            style={{ [isHorizontal ? "left" : "top"]: `${fr * 100}%` }}
            onPointerDown={(e) =>
              setDragStart({
                pointerDownCoord: { x: e.clientX, y: e.clientY },
                handleIndex: idx,
              })
            }
            draggable={false} // prevent default dnd behaviour
          >
            {line}
          </div>
        ))}
    </div>
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
