import React from "react";
import { useContextResume } from "../../AppShell";
import EmptyStateAddButton from "../../common/components/EmptyStateAddButton";
import PrimaryButton from "../../common/components/PrimaryButton";
import { WorkExperience } from "../../common/interfaces/resume";
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

  const [openAddExperiencePanel, addExperiencePanel] = useWorkExperiencePanel(
    "Add experience",
    (newExperience) => {
      setExperiences([newExperience, ...experiences!]);
    }
  );

  const isLoading = experiences === null;

  function buildContent(): React.ReactNode {
    if (isLoading) return <ShimmerCards count={3} />;

    if (experiences.length === 0)
      return (
        <EmptyStateAddButton
          label="Add work experience"
          onClick={() => openAddExperiencePanel()}
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
      />
    ));
  }

  function buildTopAddButton(): React.ReactNode {
    const button = (
      <PrimaryButton onClick={() => openAddExperiencePanel()}>
        Add experience
      </PrimaryButton>
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
    </>
  );
};

const ShimmerOverlay: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="relative">
      <div className="opacity-0">{children}</div>
      <div className="absolute inset-0 shimmer bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  );
};

const ShimmerCards: React.FC<{ count: number }> = ({ count }) => {
  return (
    <>
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <div className="h-40 shimmer bg-gray-200 rounded-md animate-pulse" />
        ))}
    </>
  );
};

export default WorkHistory;
