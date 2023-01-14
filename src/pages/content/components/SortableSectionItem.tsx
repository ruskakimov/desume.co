import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import React from "react";

const SortableSectionItem: React.FC<{
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
        "transition-shadow rounded-md relative cursor-auto hover:bg-gray-50",
        {
          "z-10 shadow-lg": isDragging,
        }
      )}
      style={style}
      {...attributes}
    >
      <div
        className={classNames(
          "absolute inset-y-0 w-10 right-0 cursor-grab touch-none",
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

export default SortableSectionItem;
