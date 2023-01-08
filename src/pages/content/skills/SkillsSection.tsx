import { PencilIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Checkbox from "../../../common/components/Checkbox";
import EmptyStateAddButton from "../../../common/components/EmptyStateAddButton";
import { BulletPoint } from "../../../common/interfaces/resume";
import SortableBulletList from "../components/SortableBulletList";

const SkillsSection: React.FC = () => {
  const [bullets, setBullets] = useState<BulletPoint[]>([
    { id: "react", text: "React", included: true },
    { id: "js", text: "JavaScript", included: true },
    { id: "ts", text: "TypeScript", included: true },
  ]);

  return (
    <div className="pb-4">
      <div className="h-10 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Skills</h3>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {["Proficient", "Experienced", "Familiar"].map((label) => (
          <div className="rounded-md border border-gray-300">
            <div className="rounded-t-md h-14 px-2 flex flex-row gap-2 items-center border-b border-gray-300 bg-gray-50">
              <div className="mx-2 h-6 flex items-center">
                <Checkbox
                  checked={true}
                  // onChange={(e) => {
                  //   onChange({ ...experience, included: e.target.checked });
                  // }}
                />
              </div>
              <span className="font-medium text-gray-900">{label}</span>

              <button
                type="button"
                className="ml-auto mr-2 flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 no-mouse-focus-ring"
              >
                <span className="sr-only">Edit skill group</span>
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            <SortableBulletList
              bullets={bullets}
              onChange={(bullets) => setBullets(bullets)}
            />
          </div>
        ))}

        <EmptyStateAddButton
          Icon={WrenchScrewdriverIcon}
          label="Add skill group"
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
};

export default SkillsSection;
