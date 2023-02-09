import { diffWords } from "diff";
import { useRef, useState } from "react";
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
      <div className="grid grid-cols-6 gap-6">
        {isCompare ? (
          <CompareView
            oldText={oldBullet?.text ?? ""}
            newText={watch("text")}
          />
        ) : (
          <>
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
          </>
        )}
      </div>

      {confirmationPopups}
    </FormModal>,
  ];
}

interface CompareViewProps {
  oldText: string;
  newText: string;
}

const CompareView: React.FC<CompareViewProps> = ({ oldText, newText }) => {
  const [showDiff, setShowDiff] = useLocalState(
    "show-compare-diff",
    true,
    (parsed) => typeof parsed === "boolean"
  );

  const chunks = diffWords(oldText, newText);

  return (
    <div className="col-span-full">
      <div className="text-sm font-medium text-gray-400">Old</div>
      <div className="text-sm text-gray-900">
        {chunks.map((chunk) => {
          if (chunk.added) return null;
          if (chunk.removed)
            return <span className="bg-red-200">{chunk.value}</span>;
          return <span>{chunk.value}</span>;
        })}
      </div>

      <div className="mt-4 text-sm font-medium text-gray-400">New</div>
      <div className="text-sm text-gray-900">
        {chunks.map((chunk) => {
          if (chunk.removed) return null;
          if (chunk.added)
            return <span className="bg-green-200">{chunk.value}</span>;
          return <span>{chunk.value}</span>;
        })}
      </div>

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
