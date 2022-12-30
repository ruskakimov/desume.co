import React from "react";
import { useContextResume } from "../../../AppShell";
import EmptyStateAddButton from "../../../common/components/EmptyStateAddButton";
import PrimaryButton from "../../../common/components/PrimaryButton";
import ShimmerCards from "../../../common/components/ShimmerCards";
import ShimmerOverlay from "../../../common/components/ShimmerOverlay";
import useConfirmationDialog from "../../../common/hooks/useConfirmationDialog";
import { ProjectExperience } from "../../../common/interfaces/resume";
import ExperienceCard from "../components/ExperienceCard";
import { withRemovedAt, withReplacedAt } from "../../../common/functions/array";
import useProjectPanel from "./useProjectPanel";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";

function useProjects(): [
  ProjectExperience[] | null,
  (experiences: ProjectExperience[]) => void
] {
  const [resume, setResume] = useContextResume();
  return [
    resume?.projectHistory ?? null,
    (experiences) => setResume({ ...resume!, projectHistory: experiences }),
  ];
}

const Projects: React.FC = () => {
  const [experiences, setExperiences] = useProjects();

  const [openAddExperiencePanel, addExperiencePanel] =
    useProjectPanel("Add project");

  const [openEditExperiencePanel, editExperiencePanel] =
    useProjectPanel("Edit project");

  const [openConfirmationDialog, confirmationDialog] = useConfirmationDialog();

  const addExperience = async () => {
    const newExperience = await openAddExperiencePanel(null);
    if (newExperience && experiences) {
      setExperiences([newExperience, ...experiences]);
    }
  };

  const isLoading = experiences === null;

  function buildContent(): React.ReactNode {
    if (isLoading) return <ShimmerCards count={3} />;

    if (experiences.length === 0)
      return (
        <EmptyStateAddButton
          Icon={RocketLaunchIcon}
          label="Add project"
          onClick={addExperience}
        />
      );

    return experiences.map((experience, index) => (
      <ExperienceCard
        title={experience.projectName}
        subtitle=""
        experience={experience}
        onChange={(editedExperience) => {
          setExperiences(
            withReplacedAt(
              experiences,
              index,
              editedExperience as ProjectExperience
            )
          );
        }}
        onEdit={async () => {
          const editedExperience = await openEditExperiencePanel(experience);
          if (editedExperience) {
            setExperiences(
              withReplacedAt(experiences, index, editedExperience)
            );
          }
        }}
        onDelete={async () => {
          const confirmed = await openConfirmationDialog({
            title: "Delete project",
            body: (
              <p className="text-sm text-gray-500">
                Delete <b>{experience.projectName}</b>? This action cannot be
                undone.
              </p>
            ),
            action: "Delete",
          });
          if (confirmed) setExperiences(withRemovedAt(experiences, index));
        }}
      />
    ));
  }

  function buildTopAddButton(): React.ReactNode {
    const button = (
      <PrimaryButton onClick={addExperience}>Add project</PrimaryButton>
    );

    if (isLoading) return <ShimmerOverlay>{button}</ShimmerOverlay>;
    if (experiences.length === 0) return null;
    return button;
  }

  return (
    <>
      <div className="h-10 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Projects
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

export default Projects;
