import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Bars2Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Checkbox from "../../../common/components/Checkbox";
import { withReplacedAt } from "../../../common/functions/array";
import { BulletPoint } from "../../../common/interfaces/resume";
import SortableBulletItem from "./SortableBulletItem";

interface SortableBulletListProps {
  bullets: BulletPoint[];
  onChange: (bullets: BulletPoint[]) => void;
}

const SortableBulletList: React.FC<SortableBulletListProps> = ({
  bullets,
  onChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const bulletIds = bullets.map((b) => b.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => {
        const { active, over } = e;

        if (active.id !== over?.id) {
          const oldIndex = bulletIds.indexOf(active.id as string);
          const newIndex = bulletIds.indexOf(over?.id as string);
          const reorderedBullets = arrayMove(bullets, oldIndex, newIndex);
          onChange(reorderedBullets);
        }
      }}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={bulletIds} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col py-2">
          {bullets.map((bullet, index) => (
            <SortableBulletItem key={bullet.id} id={bullet.id}>
              <li className="px-4 flex gap-4 items-center">
                <Checkbox
                  checked={bullet.included}
                  onChange={(e) => {
                    onChange(
                      withReplacedAt(bullets, index, {
                        ...bullet,
                        included: e.target.checked,
                      })
                    );
                  }}
                />
                <span
                  className={classNames(
                    "py-2 text-sm overflow-hidden text-ellipsis cursor-pointer",
                    {
                      "text-gray-700": bullet.included,
                      "text-gray-400": !bullet.included,
                    }
                  )}
                  onClick={() => alert("edit!")}
                >
                  {bullet.text}
                </span>
                <Bars2Icon
                  className="text-gray-400 flex-shrink-0 ml-auto h-4 w-8"
                  aria-hidden="true"
                />
              </li>
            </SortableBulletItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default SortableBulletList;
