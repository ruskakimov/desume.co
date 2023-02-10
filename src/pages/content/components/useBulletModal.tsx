import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { diffWords } from "diff";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import CheckboxField from "../../../common/components/fields/CheckboxField";
import TextAreaField from "../../../common/components/fields/TextAreaField";
import FormModal from "../../../common/components/FormModal";
import SecondaryButton from "../../../common/components/SecondaryButton";
import { generateId } from "../../../common/functions/ids";
import useEditFlow from "../../../common/hooks/useEditFlow";
import useLocalState from "../../../common/hooks/useLocalState";
import { BulletPoint } from "../../../common/interfaces/resume";

const bulletMaxLength = 200;

interface SingleBulletForm {
  included?: boolean;
  text: string;
}

function convertBulletToFormData(bullet: BulletPoint): SingleBulletForm {
  return {
    included: bullet.included,
    text: bullet.text,
  };
}

function convertFormDataToBullet(
  formData: SingleBulletForm,
  oldBullet: BulletPoint | null
): BulletPoint {
  return {
    id: oldBullet?.id ?? generateId(),
    included: formData.included ?? true,
    text: formData.text,
  };
}

type OpenBulletModal = (
  bullet: BulletPoint | null
) => Promise<BulletPoint | null>;

export default function useBulletModal(): [OpenBulletModal, React.ReactNode] {
  const [isCompare, setIsCompare] = useState(false);

  const {
    register,
    reset,
    watch,
    getValues,
    trigger,
    formState: { isDirty },
  } = useForm<SingleBulletForm>();

  const [oldBullet, setOldBullet] = useState<BulletPoint | null>(null);

  const { openEditDialog, buildDialogProps, confirmationPopups } =
    useEditFlow<BulletPoint>();

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
    setIsCompare(false);
    return openEditDialog({ isCreateNew: bullet === null });
  };

  const textareaProps = register("text");

  return [
    openModal,
    <FormModal
      initialFocusRef={textareaRef}
      {...buildDialogProps({
        titleName: "accomplishment",
        getIsDirty: () => isDirty,
        getIsValid: () => trigger(undefined, { shouldFocus: true }),
        getData: () => {
          const formData = getValues();
          const newBullet = convertFormDataToBullet(formData, oldBullet);
          return newBullet;
        },
      })}
      secondaryButton={
        isDirty ? (
          <SecondaryButton onClick={() => setIsCompare((state) => !state)}>
            {isCompare ? "Edit" : "Compare"}
          </SecondaryButton>
        ) : undefined
      }
    >
      {isCompare ? (
        <CompareView oldText={oldBullet?.text ?? ""} newText={watch("text")} />
      ) : (
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-full grid grid-cols-2 gap-3">
            {/* Success: Starts with an action verb */}
            {/* Failure: Doesn't start with an action verb */}
            <ValidationItem icon="success" label="Starts with an action verb" />

            {/* Success: Optimal length (1 line in PDF) */}
            {/* Warning: A bit short (1 line in PDF) */}
            {/* Warning: A bit long (2 lines in PDF) */}
            {/* Failure: Too short (1 line in PDF) */}
            {/* Failure: Too long (3 lines in PDF) */}
            <ValidationItem
              icon="warning"
              label="A bit long (2 lines in PDF)"
            />

            {/* Success: Includes quantitative data */}
            {/* Warning: Doesn't include quantitative data */}
            <ValidationItem
              icon="warning"
              label="Doesn't include quantitative data"
            />

            {/* Success: Correct format */}
            {/* Failure: Incorrect format */}
            <ValidationItem icon="success" label="Correct format" />
            {/* Starts with a capital, ends with a dot, one space between words. */}
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
            />
          </div>

          <div className="col-span-3 -mt-4">
            <CheckboxField
              label="Include in export"
              {...register("included")}
            />
          </div>

          <div className="col-span-3 -mt-4 flex justify-end">
            <span className="text-sm text-gray-900">
              {watch("text")?.length ?? 0}
              <span className="text-gray-500">/{bulletMaxLength}</span>
            </span>
          </div>
        </div>
      )}

      {confirmationPopups}
    </FormModal>,
  ];
}

type ValidationIcon = "success" | "warning" | "failure";

const iconMap: Record<ValidationIcon, React.ReactElement> = {
  success: (
    <CheckCircleIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
  ),
  warning: (
    <ExclamationTriangleIcon
      className="h-5 w-5 text-orange-500"
      aria-hidden="true"
    />
  ),
  failure: <XCircleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />,
};

const ValidationItem: React.FC<{
  icon: ValidationIcon;
  label: string;
}> = ({ icon, label }) => {
  return (
    <div className="flex gap-2">
      {iconMap[icon]}
      <span className="text-sm">{label}</span>
    </div>
  );
};

const CompareView: React.FC<{
  oldText: string;
  newText: string;
}> = ({ oldText, newText }) => {
  const [showDiff, setShowDiff] = useLocalState(
    "show-compare-diff",
    true,
    (parsed) => typeof parsed === "boolean"
  );

  const [oldFormatted, newFormatted] = showDiff
    ? buildRichDiff(oldText, newText)
    : [oldText, newText];

  return (
    <div>
      <div className="text-sm font-medium text-gray-400">Old</div>
      <div className="text-sm text-gray-900">{oldFormatted}</div>

      <div className="mt-4 text-sm font-medium text-gray-400">New</div>
      <div className="text-sm text-gray-900">{newFormatted}</div>

      <div className="mt-6">
        <CheckboxField
          label="Show difference"
          checked={showDiff}
          onChange={(e) => setShowDiff(e.target.checked)}
        />
      </div>
    </div>
  );
};

function buildRichDiff(
  oldText: string,
  newText: string
): [React.ReactElement, React.ReactElement] {
  const chunks = diffWords(oldText, newText);

  return [
    <>
      {chunks.map((chunk, i) => {
        if (chunk.added) return null;
        if (chunk.removed)
          return (
            <span key={i} className="bg-red-200">
              {chunk.value}
            </span>
          );
        return <span key={i}>{chunk.value}</span>;
      })}
    </>,
    <>
      {chunks.map((chunk, i) => {
        if (chunk.removed) return null;
        if (chunk.added)
          return (
            <span key={i} className="bg-green-200">
              {chunk.value}
            </span>
          );
        return <span key={i}>{chunk.value}</span>;
      })}
    </>,
  ];
}
