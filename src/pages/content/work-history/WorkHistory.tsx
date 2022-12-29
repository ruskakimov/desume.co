import React from "react";
import { useContextResume } from "../../../AppShell";
import EmptyStateAddButton from "../../../common/components/EmptyStateAddButton";
import PrimaryButton from "../../../common/components/PrimaryButton";
import ShimmerCards from "../../../common/components/ShimmerCards";
import ShimmerOverlay from "../../../common/components/ShimmerOverlay";
import useConfirmationDialog from "../../../common/hooks/useConfirmationDialog";
import { WorkExperience } from "../../../common/interfaces/resume";
import useWorkExperiencePanel from "./useWorkExperiencePanel";
import ExperienceCard from "../ExperienceCard";

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

  const [openConfirmationDialog, confirmationDialog] = useConfirmationDialog();

  const addExperience = async () => {
    const newExperience = await openAddExperiencePanel(null);
    if (newExperience && experiences) {
      setExperiences([newExperience, ...experiences]);
    }
  };

  const replaceExperienceAt = (
    index: number,
    editedExperience: WorkExperience
  ) => {
    if (experiences) {
      const slice = experiences.slice();
      slice[index] = editedExperience;
      setExperiences(slice);
    }
  };

  const deleteExperienceAt = (index: number) => {
    if (experiences) {
      setExperiences([
        ...experiences.slice(0, index),
        ...experiences.slice(index + 1),
      ]);
    }
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
      <ExperienceCard
        title={experience.companyName}
        subtitle={experience.jobTitle}
        experience={experience}
        onChange={(editedExperience) => {
          replaceExperienceAt(index, editedExperience as WorkExperience);
        }}
        onEdit={async () => {
          const editedExperience = await openEditExperiencePanel(experience);
          if (editedExperience) {
            replaceExperienceAt(index, editedExperience);
          }
        }}
        onDelete={async () => {
          const confirmed = await openConfirmationDialog({
            title: "Delete experience",
            body: (
              <p className="text-sm text-gray-500">
                Delete{" "}
                <b>
                  {experience.jobTitle} at {experience.companyName}
                </b>
                ? This action cannot be undone.
              </p>
            ),
            action: "Delete",
          });
          if (confirmed) deleteExperienceAt(index);
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
      {confirmationDialog}
    </>
  );
};

export default WorkHistory;
