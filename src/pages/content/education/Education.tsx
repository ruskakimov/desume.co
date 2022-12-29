import React from "react";
import { useContextResume } from "../../../AppShell";
import EmptyStateAddButton from "../../../common/components/EmptyStateAddButton";
import PrimaryButton from "../../../common/components/PrimaryButton";
import ShimmerCards from "../../../common/components/ShimmerCards";
import ShimmerOverlay from "../../../common/components/ShimmerOverlay";
import useConfirmationDialog from "../../../common/hooks/useConfirmationDialog";
import { EducationExperience } from "../../../common/interfaces/resume";
import ExperienceCard from "../ExperienceCard";
import { withRemovedAt, withReplacedAt } from "../../../common/functions/array";

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

const Education: React.FC = () => {
  const [experiences, setExperiences] = useEducation();

  // const [openAddExperiencePanel, addExperiencePanel] =
  //   useWorkExperiencePanel("Add experience");

  // const [openEditExperiencePanel, editExperiencePanel] =
  //   useWorkExperiencePanel("Edit experience");

  const [openConfirmationDialog, confirmationDialog] = useConfirmationDialog();

  const addExperience = async () => {
    //   const newExperience = await openAddExperiencePanel(null);
    //   if (newExperience && experiences) {
    //     setExperiences([newExperience, ...experiences]);
    //   }
  };

  const isLoading = experiences === null;

  function buildContent(): React.ReactNode {
    if (isLoading) return <ShimmerCards count={3} />;

    if (experiences.length === 0)
      return (
        <EmptyStateAddButton label="Add education" onClick={addExperience} />
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
        onEdit={async () => {
          // const editedExperience = await openEditExperiencePanel(experience);
          // if (editedExperience) {
          //   setExperiences(
          //     withReplacedAt(experiences, index, editedExperience)
          //   );
          // }
        }}
        onDelete={async () => {
          const confirmed = await openConfirmationDialog({
            title: "Delete education",
            body: (
              <p className="text-sm text-gray-500">
                Delete{" "}
                <b>
                  {experience.degree} at {experience.schoolName}
                </b>
                ? This action cannot be undone.
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
      <PrimaryButton onClick={addExperience}>Add education</PrimaryButton>
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

      {/* {addExperiencePanel} */}
      {/* {editExperiencePanel} */}
      {confirmationDialog}
    </>
  );
};

export default Education;
