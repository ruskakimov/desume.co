import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextAreaField from "../../../../common/components/fields/TextAreaField";
import FormModal from "../../../../common/components/FormModal";
import SecondaryButton from "../../../../common/components/SecondaryButton";
import { generateId } from "../../../../common/functions/ids";
import useEditFlow from "../../../../common/hooks/useEditFlow";
import { BulletPoint } from "../../../../common/interfaces/resume";
import { fixFormat } from "./format";
import { ValidationItem } from "./ValidationItem";
import {
  validateActionVerb,
  validateLength,
  validateQuantitativeData,
} from "./validators";

const bulletMaxLength = 250;

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

type OpenBulletModal = (
  bullet: BulletPoint | null
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
    cancelEditFlow,
    buildDialogProps,
    confirmationPopups,
  } = useEditFlow<BulletPoint>();

  const formRef = useRef<HTMLFormElement | null>(null);
  const textareaRef = useRef<HTMLElement | null>(null);

  const openModal = (bullet: BulletPoint | null) => {
    if (bullet) {
      // Edit bullet
      const prefilledForm = convertBulletToFormData(bullet);
      reset(prefilledForm);
    } else {
      // Add new bullet
      reset({});
    }
    setOldBullet(bullet);
    return openEditDialog({ isCreateNew: bullet === null });
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
            onClick={() => {
              cancelEditFlow();
            }}
          >
            Rewrite mode
          </SecondaryButton>
        ) : null
      }
    >
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-full grid grid-cols-2 gap-3">
          <ValidationItem {...validateActionVerb(newText)} />
          <ValidationItem {...validateLength(newText)} />
          <ValidationItem {...validateQuantitativeData(newText)} />
        </div>

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
