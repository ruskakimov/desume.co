import React from "react";
import { useContextResume } from "../../../AppShell";
import EmptyStateAddButton from "../../../common/components/EmptyStateAddButton";
import PrimaryButton from "../../../common/components/PrimaryButton";
import ShimmerCards from "../../../common/components/ShimmerCards";
import ShimmerOverlay from "../../../common/components/ShimmerOverlay";
import { ProjectExperience } from "../../../common/interfaces/resume";
import ExperienceCard from "../components/ExperienceCard";
import { withRemovedAt, withReplacedAt } from "../../../common/functions/array";
import useProjectPanel from "./useProjectPanel";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import { sortExperiences } from "../../../common/functions/experiences";
import { userCancelReason } from "../../../common/constants/reject-reasons";

function useProjects(): [
  ProjectExperience[] | null,
  (experiences: ProjectExperience[]) => void
] {
  const [resume, setResume] = useContextResume();
  return [
    resume?.projectHistory ?? null,
    (experiences) =>
      setResume({ ...resume!, projectHistory: sortExperiences(experiences) }),
  ];
}

const ProjectsSection: React.FC = () => {
  const [experiences, setExperiences] = useProjects();
  const [openEditExperiencePanel, editExperiencePanel] = useProjectPanel();

  const handleAdd = async () => {
    openEditExperiencePanel(null)
      .then((newExperience) => {
        if (newExperience && experiences) {
          setExperiences([newExperience, ...experiences]);
        }
      })
      .catch((e) => {
        if (e !== userCancelReason) console.error(e);
      });
  };

  const isLoading = experiences === null;

  function buildContent(): React.ReactNode {
    if (isLoading) return <ShimmerCards count={3} />;

    if (experiences.length === 0)
      return (
        <EmptyStateAddButton
          Icon={RocketLaunchIcon}
          label="Add project"
          onClick={handleAdd}
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
        onEditClick={async () => {
          openEditExperiencePanel(experience)
            .then((editedExperience) => {
              if (editedExperience) {
                setExperiences(
                  withReplacedAt(experiences, index, editedExperience)
                );
              } else {
                setExperiences(withRemovedAt(experiences, index));
              }
            })
            .catch((e) => {
              if (e !== userCancelReason) console.error(e);
            });
        }}
      />
    ));
  }

  function buildTopAddButton(): React.ReactNode {
    const button = (
      <PrimaryButton onClick={handleAdd}>Add project</PrimaryButton>
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

      {editExperiencePanel}
    </>
  );
};

export default ProjectsSection;
