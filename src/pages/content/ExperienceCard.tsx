import { Bars2Icon } from "@heroicons/react/24/outline";
import Checkbox from "../../common/components/Checkbox";
import EllipsisMenu from "../../common/components/EllipsisMenu";
import { Experience } from "../../common/interfaces/resume";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import classNames from "classnames";
import { monthYearToString } from "../../common/functions/time";

interface ExperienceCardProps {
  title: string;
  subtitle: string;
  experience: Experience;
  onChange: (experience: Experience) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  subtitle,
  experience,
  onChange,
  onEdit,
  onDelete,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const bulletIds = experience.bulletPoints.map((b) => b.id);

  const start = monthYearToString(experience.startDate);
  const end = experience.endDate
    ? monthYearToString(experience.endDate)
    : "Current";

  return (
    <>
      <div className="w-full border sm:rounded-md">
        <div className="sm:rounded-t-md px-2 h-14 flex flex-row items-center gap-2 border-b bg-gray-50">
          <div className="mx-2 h-6 flex items-center">
            <Checkbox
              checked={experience.included}
              onChange={(e) => {
                onChange({ ...experience, included: e.target.checked });
              }}
            />
          </div>

          <span className="font-medium text-gray-900">{title}</span>

          <span className="font-normal text-gray-700">{subtitle}</span>

          <span className="ml-auto font-normal text-gray-500">{`${start} – ${end}`}</span>

          <EllipsisMenu
            menuItems={[
              {
                label: "Edit",
                onClick: onEdit,
              },
              {
                label: "Delete",
                onClick: onDelete,
              },
            ]}
          />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => {
            const { active, over } = e;

            if (active.id !== over?.id) {
              const oldIndex = bulletIds.indexOf(active.id as string);
              const newIndex = bulletIds.indexOf(over?.id as string);

              const newBullets = arrayMove(
                experience.bulletPoints,
                oldIndex,
                newIndex
              );

              onChange({ ...experience, bulletPoints: newBullets });
            }
          }}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={bulletIds}
            strategy={verticalListSortingStrategy}
          >
            <ul className="flex flex-col py-2">
              {experience.bulletPoints.map((bulletPoint, index) => (
                <SortableItem key={bulletPoint.id} id={bulletPoint.id}>
                  <li className="py-2 px-4 flex gap-4 items-center">
                    <Checkbox
                      checked={bulletPoint.included}
                      onChange={(e) => {
                        const newBullets = experience.bulletPoints.slice();
                        newBullets[index] = {
                          ...newBullets[index],
                          included: e.target.checked,
                        };
                        onChange({ ...experience, bulletPoints: newBullets });
                      }}
                    />
                    <span
                      className={classNames("text-sm", {
                        "text-gray-700": bulletPoint.included,
                        "text-gray-400": !bulletPoint.included,
                      })}
                    >
                      {bulletPoint.text}
                    </span>
                    <Bars2Icon
                      className="text-gray-400 flex-shrink-0 ml-auto h-4 w-8"
                      aria-hidden="true"
                    />
                  </li>
                </SortableItem>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
};

export default ExperienceCard;
