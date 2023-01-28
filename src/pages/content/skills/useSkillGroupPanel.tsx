import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import TextAreaField from "../../../common/components/fields/TextAreaField";
import TextField from "../../../common/components/fields/TextField";
import SlideOver from "../../../common/components/SlideOver";
import { userCancelReason } from "../../../common/constants/reject-reasons";
import { generateId, generateIds } from "../../../common/functions/ids";
import useConfirmationDialog from "../../../common/hooks/useConfirmationDialog";
import useDiscardChangesDialog from "../../../common/hooks/useDiscardChangesDialog";
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

type ResolveCallback = (skillGroup: SkillGroup | null) => void;
type RejectCallback = (reason: string) => void;

export default function useSkillGroupPanel(
  title: string
): [OpenSkillGroupPanel, React.ReactNode] {
  const [hasDelete, setHasDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty },
  } = useForm<SkillGroupForm>();

  const oldSkillGroupRef = useRef<SkillGroup | null>(null);
  const resolveCallbackRef = useRef<ResolveCallback | null>(null);
  const rejectCallbackRef = useRef<RejectCallback | null>(null);

  const skillsTextareaRef = useRef<HTMLElement | null>(null);

  const [openConfirmationDialog, confirmationDialog] = useConfirmationDialog();
  const [getDiscardConfirmation, discardConfirmationDialog] =
    useDiscardChangesDialog();

  const openPanel = (
    skillGroup: SkillGroup | null,
    onResolve: ResolveCallback,
    onReject: RejectCallback
  ) => {
    if (skillGroup) {
      // Edit skill group
      const prefilledForm = convertSkillGroupToFormData(skillGroup);
      reset(prefilledForm);
      setHasDelete(true);
    } else {
      // Add a new skill group
      reset();
      setHasDelete(false);
    }
    oldSkillGroupRef.current = skillGroup;
    resolveCallbackRef.current = onResolve;
    rejectCallbackRef.current = onReject;
    setIsOpen(true);
  };

  const closePanel = () => setIsOpen(false);

  const onSubmit: SubmitHandler<SkillGroupForm> = (formData) => {
    const newExperience = convertFormDataToSkillGroup(
      formData,
      oldSkillGroupRef.current
    );
    resolveCallbackRef.current?.(newExperience);
    closePanel();
  };

  const onCancel = async () => {
    if (!isDirty || (await getDiscardConfirmation())) {
      rejectCallbackRef.current?.(userCancelReason);
      closePanel();
    }
  };

  const onDelete = async () => {
    const groupName = getValues("groupName");
    const skillCount = convertFormDataToSkillGroup(getValues(), null).skills
      .length;

    const confirmed = await openConfirmationDialog({
      title: "Delete skill group",
      body: (
        <p className="text-sm text-gray-500">
          Delete <b>{groupName}</b> with <b>{skillCount} skills</b>? This action
          cannot be undone.
        </p>
      ),
      action: "Delete",
    });

    if (confirmed) {
      resolveCallbackRef.current?.(null);
      closePanel();
    }
  };

  const skillsProps = register("skillsCsv");

  return [
    (skillGroup) =>
      new Promise((resolve, reject) => {
        openPanel(skillGroup, resolve, reject);
      }),
    <SlideOver
      isOpen={isOpen}
      title={title}
      onCancel={onCancel}
      onSubmit={handleSubmit(onSubmit)}
      onDelete={hasDelete ? onDelete : undefined}
      initialFocusRef={skillsTextareaRef}
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

      {discardConfirmationDialog}
      {confirmationDialog}
    </SlideOver>,
  ];
}
