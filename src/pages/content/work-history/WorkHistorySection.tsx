import React from "react";
import { useContextResume } from "../../../AppShell";
import EmptyStateAddButton from "../../../common/components/EmptyStateAddButton";
import PrimaryButton from "../../../common/components/PrimaryButton";
import ShimmerCards from "../../../common/components/ShimmerCards";
import ShimmerOverlay from "../../../common/components/ShimmerOverlay";
import { WorkExperience } from "../../../common/interfaces/resume";
import useWorkExperiencePanel from "./useWorkExperiencePanel";
import ExperienceCard from "../components/ExperienceCard";
import { withRemovedAt, withReplacedAt } from "../../../common/functions/array";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { sortExperiences } from "../../../common/functions/experiences";
import { userCancelReason } from "../../../common/constants/reject-reasons";

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

const WorkHistorySection: React.FC = () => {
  const [experiences, setExperiences] = useWorkHistory();

  const [openAddExperiencePanel, addExperiencePanel] =
    useWorkExperiencePanel("Add experience");

  const [openEditExperiencePanel, editExperiencePanel] =
    useWorkExperiencePanel("Edit experience");

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
          Icon={BriefcaseIcon}
          label="Add work experience"
          onClick={handleAdd}
        />
      );

    return experiences.map((experience, index) => (
      <ExperienceCard
        title={experience.companyName}
        subtitle={experience.jobTitle}
        experience={experience}
        onChange={(editedExperience) => {
          setExperiences(
            withReplacedAt(
              experiences,
              index,
              editedExperience as WorkExperience
            )
          );
        }}
        onEditClick={() => {
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
      <PrimaryButton onClick={handleAdd}>Add experience</PrimaryButton>
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

export default WorkHistorySection;
