import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";

export function SortableItem(props: any) {
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
      className={classNames({
        "z-10 shadow-md": isDragging,
      })}
      style={style}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </div>
  );
}
