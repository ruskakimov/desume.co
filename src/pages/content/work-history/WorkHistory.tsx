import React from "react";
import { useContextResume } from "../../../AppShell";
import EmptyStateAddButton from "../../../common/components/EmptyStateAddButton";
import PrimaryButton from "../../../common/components/PrimaryButton";
import ShimmerCards from "../../../common/components/ShimmerCards";
import ShimmerOverlay from "../../../common/components/ShimmerOverlay";
import { WorkExperience } from "../../../common/interfaces/resume";
import useWorkExperiencePanel from "./useWorkExperiencePanel";
import WorkHistoryCard from "./WorkHistoryCard";

function useWorkHistory(): [
  WorkExperience[] | null,
  (experiences: WorkExperience[]) => void
] {
  const [resume, setResume] = useContextResume();
  return [
    resume?.workHistory ?? null,
    (experiences) => setResume({ ...resume!, workHistory: experiences }),
  ];
}

const WorkHistory: React.FC = () => {
  const [experiences, setExperiences] = useWorkHistory();

  const [openAddExperiencePanel, addExperiencePanel] =
    useWorkExperiencePanel("Add experience");

  const [openEditExperiencePanel, editExperiencePanel] =
    useWorkExperiencePanel("Edit experience");

  const addExperience = async () => {
    const newExperience = await openAddExperiencePanel(null);
    if (newExperience) setExperiences([newExperience, ...(experiences ?? [])]);
  };

  const isLoading = experiences === null;

  function buildContent(): React.ReactNode {
    if (isLoading) return <ShimmerCards count={3} />;

    if (experiences.length === 0)
      return (
        <EmptyStateAddButton
          label="Add work experience"
          onClick={addExperience}
        />
      );

    return experiences.map((experience, index) => (
      <WorkHistoryCard
        experience={experience}
        onChange={(editedExperience) => {
          if (editedExperience === null) {
            // Deleted
            setExperiences([
              ...experiences.slice(0, index),
              ...experiences.slice(index + 1),
            ]);
          } else {
            // Edited
            const slice = experiences.slice();
            slice[index] = editedExperience;
            setExperiences(slice);
          }
        }}
        onEdit={async () => {
          const editedExperience = await openEditExperiencePanel(experience);
          if (editedExperience) {
            const slice = experiences.slice();
            slice[index] = editedExperience;
            setExperiences(slice);
          }
        }}
      />
    ));
  }

  function buildTopAddButton(): React.ReactNode {
    const button = (
      <PrimaryButton onClick={addExperience}>Add experience</PrimaryButton>
    );

    if (isLoading) return <ShimmerOverlay>{button}</ShimmerOverlay>;
    if (experiences.length === 0) return null;
    return button;
  }

  return (
    <>
      <div className="h-10 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Work history
        </h3>

        {buildTopAddButton()}
      </div>

      <div className="space-y-8 pb-4">{buildContent()}</div>

      {addExperiencePanel}
      {editExperiencePanel}
    </>
  );
};

export default WorkHistory;
