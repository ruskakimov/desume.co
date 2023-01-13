import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import React from "react";

const SortableCardItem: React.FC<{ id: string; children: React.ReactNode }> = (
  props
) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={classNames(
        "rounded-md border border-gray-300 transition-shadow relative cursor-auto",
        {
          "z-10 shadow-lg": isDragging,
        }
      )}
      style={style}
      {...attributes}
    >
      <div
        className={classNames(
          "absolute h-14 top-0 left-12 right-12 cursor-grab touch-none",
          {
            "cursor-grabbing": isDragging,
          }
        )}
        {...listeners}
      />
      {props.children}
    </div>
  );
};

export default SortableCardItem;
