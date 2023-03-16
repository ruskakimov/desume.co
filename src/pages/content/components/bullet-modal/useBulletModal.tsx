import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextAreaField from "../../../../common/components/fields/TextAreaField";
import FormModal from "../../../../common/components/FormModal";
import SecondaryButton from "../../../../common/components/SecondaryButton";
import { launchRewriteModeReason } from "../../../../common/constants/reject-reasons";
import { generateId } from "../../../../common/functions/ids";
import useEditFlow from "../../../../common/hooks/useEditFlow";
import { BulletPoint } from "../../../../common/interfaces/resume";
import { fixFormat } from "./format";

export const bulletMaxLength = 300;

interface SingleBulletForm {
  text: string;
}

function convertBulletToFormData(bullet: BulletPoint): SingleBulletForm {
  return {
    text: bullet.text,
  };
}

function convertFormDataToBullet(
  formData: SingleBulletForm,
  oldBullet: BulletPoint | null
): BulletPoint {
  return {
    id: oldBullet?.id ?? generateId(),
    included: oldBullet?.included ?? true,
    text: formData.text,
  };
}

export type OpenBulletModal = (
  bullet: BulletPoint | null,
  hasDelete?: boolean
) => Promise<BulletPoint | null>;

export default function useBulletModal(): [OpenBulletModal, React.ReactNode] {
  const {
    register,
    reset,
    watch,
    getValues,
    trigger,
    formState: { isDirty },
  } = useForm<SingleBulletForm>();

  const [oldBullet, setOldBullet] = useState<BulletPoint | null>(null);

  const {
    openEditDialog,
    closeEditDialog,
    buildDialogProps,
    confirmationPopups,
  } = useEditFlow<BulletPoint>();

  const formRef = useRef<HTMLFormElement | null>(null);
  const textareaRef = useRef<HTMLElement | null>(null);

  const openModal: OpenBulletModal = (bullet, hasDelete) => {
    if (bullet) {
      // Edit bullet
      const prefilledForm = convertBulletToFormData(bullet);
      reset(prefilledForm);
    } else {
      // Add new bullet
      reset({});
    }
    setOldBullet(bullet);
    return openEditDialog({ isCreateNew: bullet === null, hasDelete });
  };

  const textareaProps = register("text", {
    required: true,
    minLength: 1,
    maxLength: bulletMaxLength,
  });

  const newText = watch("text") ?? "";
  const isEmpty = fixFormat(newText) === "";

  return [
    openModal,
    <FormModal
      formRef={formRef}
      initialFocusRef={textareaRef}
      {...buildDialogProps({
        titleName: "accomplishment",
        getIsDirty: () => isDirty,
        getIsValid: () => trigger(undefined, { shouldFocus: true }),
        getData: () => {
          const formData = getValues();
          formData.text = fixFormat(formData.text);
          const newBullet = convertFormDataToBullet(formData, oldBullet);
          return newBullet;
        },
      })}
      canSubmit={isDirty && !isEmpty}
      secondaryButton={
        !isDirty && oldBullet ? (
          <SecondaryButton
            onClick={() => closeEditDialog(launchRewriteModeReason)}
          >
            Rewrite
            <span className="px-2 ml-2 h-full flex items-center text-xs font-bold bg-sky-500 tracking-wide text-white rounded-full">
              AI
            </span>
          </SecondaryButton>
        ) : null
      }
    >
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-full">
          <TextAreaField
            label="Accomplishment"
            rows={3}
            maxLength={bulletMaxLength}
            {...textareaProps}
            ref={(el) => {
              textareaRef.current = el;
              textareaProps.ref(el);
            }}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
        </div>

        <div className="col-span-full -mt-4 flex justify-end">
          <span className="text-sm text-gray-900">
            {newText.length}
            <span className="text-gray-500">/{bulletMaxLength}</span>
          </span>
        </div>
      </div>

      {confirmationPopups}
    </FormModal>,
  ];
}
