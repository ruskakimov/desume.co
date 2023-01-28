import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import TextAreaField from "../../../common/components/fields/TextAreaField";
import TextField from "../../../common/components/fields/TextField";
import SlideOver from "../../../common/components/SlideOver";
import { generateId, generateIds } from "../../../common/functions/ids";
import useEditFlow from "../../../common/hooks/useEditFlow";
import { BulletPoint, SkillGroup } from "../../../common/interfaces/resume";

interface SkillGroupForm {
  groupName: string;
  skillsCsv: string;
}

function convertFormDataToSkillGroup(
  formData: SkillGroupForm,
  oldSkillGroup: SkillGroup | null
): SkillGroup {
  const skillsByText: Record<string, BulletPoint | undefined> = {};
  oldSkillGroup?.skills.forEach((skill) => (skillsByText[skill.text] = skill));

  const parsedSkills = formData.skillsCsv
    .split(",")
    .map((text) => text.trim())
    .filter((text) => text.length > 0);

  const newIds = generateIds(parsedSkills.length);

  return {
    id: oldSkillGroup?.id ?? generateId(),
    groupName: formData.groupName,
    included: oldSkillGroup?.included ?? true,
    skills: parsedSkills.map(
      (text, index) =>
        skillsByText[text] ?? {
          id: newIds[index],
          included: true,
          text,
        }
    ),
  };
}

function convertSkillGroupToFormData(skillGroup: SkillGroup): SkillGroupForm {
  return {
    groupName: skillGroup.groupName,
    skillsCsv: skillGroup.skills.map((skill) => skill.text).join(", "),
  };
}

/**
 * @param skillGroup skill group for edit or `null` for a new one.
 * @returns a promise of edited skill group or `null` if deleted. Promise is rejected if user cancels.
 */
type OpenSkillGroupPanel = (
  skillGroup: SkillGroup | null
) => Promise<SkillGroup | null>;

export default function useSkillGroupPanel(): [
  OpenSkillGroupPanel,
  React.ReactNode
] {
  const {
    register,
    reset,
    getValues,
    trigger,
    formState: { isDirty },
  } = useForm<SkillGroupForm>();

  const oldSkillGroupRef = useRef<SkillGroup | null>(null);
  const skillsTextareaRef = useRef<HTMLElement | null>(null);

  const { openEditDialog, buildDialogProps, confirmationPopups } =
    useEditFlow<SkillGroup>();

  const openPanel = (skillGroup: SkillGroup | null) => {
    if (skillGroup) {
      // Edit skill group
      const prefilledForm = convertSkillGroupToFormData(skillGroup);
      reset(prefilledForm);
    } else {
      // Add a new skill group
      reset({});
    }
    oldSkillGroupRef.current = skillGroup;
    return openEditDialog({ isCreateNew: skillGroup === null });
  };

  const skillsProps = register("skillsCsv");

  return [
    openPanel,
    <SlideOver
      initialFocusRef={skillsTextareaRef}
      {...buildDialogProps({
        titleName: "skill group",
        getIsDirty: () => isDirty,
        getIsValid: () => trigger(undefined, { shouldFocus: true }),
        getDeleteName: () => {
          const skillCount = convertFormDataToSkillGroup(getValues(), null)
            .skills.length;
          return `${getValues("groupName")} (${skillCount} skills)`;
        },
        getData: () => {
          const formData = getValues();
          return convertFormDataToSkillGroup(
            formData,
            oldSkillGroupRef.current
          );
        },
      })}
    >
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-full">
          <TextField
            label="Group name"
            placeholder="Ex: Proficient"
            {...register("groupName", { required: true })}
          />
        </div>

        <div className="col-span-full">
          <TextAreaField
            label="Skills (comma separated)"
            placeholder="Ex: JavaScript, UI/UX design, Leadership"
            rows={5}
            {...skillsProps}
            ref={(el) => {
              skillsTextareaRef.current = el;
              skillsProps.ref(el);
            }}
          />
        </div>
      </div>

      {confirmationPopups}
    </SlideOver>,
  ];
}
