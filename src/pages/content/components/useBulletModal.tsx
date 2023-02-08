import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextAreaField from "../../../common/components/fields/TextAreaField";
import FormModal from "../../../common/components/FormModal";
import { generateId } from "../../../common/functions/ids";
import useEditFlow from "../../../common/hooks/useEditFlow";
import { BulletPoint } from "../../../common/interfaces/resume";

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
  const {
    register,
    reset,
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
        getDeleteName: () => `this accomplishment`,
        getData: () => {
          const formData = getValues();
          const newBullet = convertFormDataToBullet(formData, oldBullet);
          return newBullet;
        },
      })}
    >
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-full">
          <TextAreaField
            label="Accomplishment"
            rows={3}
            {...textareaProps}
            ref={(el) => {
              textareaRef.current = el;
              textareaProps.ref(el);
            }}
          />
        </div>
      </div>

      {confirmationPopups}
    </FormModal>,
  ];
}
