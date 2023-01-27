import React from "react";
import { useContextResume } from "../../../AppShell";
import EmptyStateAddButton from "../../../common/components/EmptyStateAddButton";
import PrimaryButton from "../../../common/components/PrimaryButton";
import ShimmerCards from "../../../common/components/ShimmerCards";
import ShimmerOverlay from "../../../common/components/ShimmerOverlay";
import useConfirmationDialog from "../../../common/hooks/useConfirmationDialog";
import { EducationExperience } from "../../../common/interfaces/resume";
import ExperienceCard from "../components/ExperienceCard";
import { withRemovedAt, withReplacedAt } from "../../../common/functions/array";
import useEducationPanel from "./useEducationPanel";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { sortExperiences } from "../../../common/functions/experiences";
import { userCancelReason } from "../../../common/constants/reject-reasons";

function useEducation(): [
  EducationExperience[] | null,
  (experiences: EducationExperience[]) => void
] {
  const [resume, setResume] = useContextResume();
  return [
    resume?.educationHistory ?? null,
    (experiences) => setResume({ ...resume!, educationHistory: experiences }),
  ];
}

const EducationSection: React.FC = () => {
  const [experiences, setExperiences] = useEducation();

  const [openAddExperiencePanel, addExperiencePanel] =
    useEducationPanel("Add education");

  const [openEditExperiencePanel, editExperiencePanel] =
    useEducationPanel("Edit education");

  const handleAdd = async () => {
    openAddExperiencePanel(null)
      .then((newExperience) => {
        if (newExperience && experiences) {
          setExperiences(sortExperiences([newExperience, ...experiences]));
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
          Icon={AcademicCapIcon}
          label="Add education"
          onClick={handleAdd}
        />
      );

    return experiences.map((experience, index) => (
      <ExperienceCard
        title={experience.schoolName}
        subtitle={experience.degree}
        experience={experience}
        onChange={(editedExperience) => {
          setExperiences(
            withReplacedAt(
              experiences,
              index,
              editedExperience as EducationExperience
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
      <PrimaryButton onClick={handleAdd}>Add education</PrimaryButton>
    );

    if (isLoading) return <ShimmerOverlay>{button}</ShimmerOverlay>;
    if (experiences.length === 0) return null;
    return button;
  }

  return (
    <>
      <div className="h-10 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Education
        </h3>

        {buildTopAddButton()}
      </div>

      <div className="space-y-8 pb-4">{buildContent()}</div>

      {addExperiencePanel}
      {editExperiencePanel}
    </>
  );
};

export default EducationSection;
