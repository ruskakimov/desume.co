import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import React from "react";

const SortableBulletItem: React.FC<{
  id: string;
  children: React.ReactNode;
}> = (props) => {
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
        "transition-shadow relative cursor-auto hover:bg-gray-50",
        {
          "z-10 shadow-lg ring-inset ring-2 ring-gray-400 bg-white": isDragging,
        }
      )}
      style={style}
      {...attributes}
    >
      <div
        className={classNames(
          "absolute inset-y-0 w-16 right-0 cursor-grab touch-none",
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

export default SortableBulletItem;
