import React, { useRef, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import MonthYearField from "../../../common/components/fields/MonthYearField";
import TextField from "../../../common/components/fields/TextField";
import WebsiteField from "../../../common/components/fields/WebsiteField";
import SlideOver from "../../../common/components/SlideOver";
import { generateIds } from "../../../common/functions/ids";
import {
  BulletPoint,
  EducationExperience,
  SkillGroup,
} from "../../../common/interfaces/resume";
import BulletForm, { FormBullet } from "../components/BulletForm";

interface SkillGroupForm {
  groupName: string;
  skillsCsv: string;
}

function convertFormDataToSkillGroup(
  formData: SkillGroupForm,
  oldSkillGroup: SkillGroup
): SkillGroup {
  const skillsByText: Record<string, BulletPoint | undefined> = {};
  oldSkillGroup.skills.forEach((skill) => (skillsByText[skill.text] = skill));

  const parsedSkills = formData.skillsCsv
    .split(",")
    .map((skillText) => skillText.trim());

  const newIds = generateIds(parsedSkills.length);

  return {
    groupName: formData.groupName,
    included: oldSkillGroup.included,
    skills: parsedSkills.map((skillText, index) => ({
      id: skillsByText[skillText]?.id ?? newIds[index],
      text: skillText,
      included: skillsByText[skillText]?.included ?? true,
    })),
  };
}

function convertSkillGroupToFormData(skillGroup: SkillGroup): SkillGroupForm {
  return {
    groupName: skillGroup.groupName,
    skillsCsv: skillGroup.skills.map((skill) => skill.text).join(", "),
  };
}

/**
 * @param experience experience for edit or `null` for a new one.
 * @returns a promise of edited experience or `null` if user cancels.
 */
type OpenEducationPanel = (
  experience: EducationExperience | null
) => Promise<EducationExperience | null>;

/**
 * @returns edited experience or `null` if user cancels.
 */
type ResolveCallback = (experience: EducationExperience | null) => void;

export default function useSkillGroupPanel(
  title: string
): [OpenEducationPanel, React.ReactNode] {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<SkillGroupForm>();
  const [bullets, setBullets] = useState<FormBullet[]>([]);
  const resolveCallbackRef = useRef<ResolveCallback | null>(null);

  const openPanel = (
    experience: EducationExperience | null,
    onResolve: ResolveCallback
  ) => {
    if (experience) {
      // Edit experience
      const prefilledForm = convertSkillGroupToFormData(experience);
      reset(prefilledForm);
      setBullets(
        experience.bulletPoints.map((bulletPoint) => ({
          ...bulletPoint,
          shouldDelete: false,
        }))
      );
    } else {
      // Add experience
      reset();
      setBullets([]);
    }
    resolveCallbackRef.current = onResolve;
    setIsOpen(true);
  };

  const closePanel = () => setIsOpen(false);

  const onSubmit: SubmitHandler<SkillGroupForm> = (formData) => {
    const newExperience = convertFormDataToSkillGroup(formData);
    newExperience.bulletPoints = bullets.filter((b) => !b.shouldDelete);
    resolveCallbackRef.current?.(newExperience);
    closePanel();
  };

  const onCancel = () => {
    resolveCallbackRef.current?.(null);
    closePanel();
  };

  const onError: SubmitErrorHandler<SkillGroupForm> = (error) =>
    console.error(error);

  const currentYear = new Date().getFullYear();

  return [
    (experience) =>
      new Promise((resolve) => {
        openPanel(experience, resolve);
      }),
    <SlideOver
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-6 sm:col-span-3">
          <TextField
            label="School name"
            {...register("schoolName", { required: true })}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <WebsiteField
            label="School website"
            {...register("schoolWebsiteUrl")}
          />
        </div>

        <div className="col-span-6">
          <TextField
            label="Degree and field of study"
            {...register("degree", { required: true })}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <MonthYearField
            label="Start date"
            endYear={currentYear}
            monthProps={register("startDateMonth", {
              required: true,
            })}
            yearProps={register("startDateYear", {
              required: true,
            })}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <MonthYearField
            label="End date (or expected)"
            endYear={currentYear + 8}
            monthProps={register("endDateMonth", {
              required: true,
            })}
            yearProps={register("endDateYear", {
              required: true,
            })}
          />
        </div>
      </div>

      <BulletForm bullets={bullets} onChange={setBullets} />
    </SlideOver>,
  ];
}
