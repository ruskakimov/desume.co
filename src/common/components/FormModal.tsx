import { useRef } from "react";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { EditDialogProps } from "../hooks/useEditFlow";
import Modal from "./Modal";

interface FormModalProps extends EditDialogProps {
  children: React.ReactNode;
  secondaryButton?: React.ReactNode;
  formRef?: React.MutableRefObject<HTMLFormElement | null>;
  initialFocusRef?: React.MutableRefObject<HTMLElement | null>;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  title,
  children,
  onCancel,
  onSubmit,
  onDelete,
  secondaryButton,
  formRef,
  initialFocusRef,
  canSubmit,
}) => {
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const footerButtons = (
    <>
      {onDelete && (
        <SecondaryButton className="text-red-600 mr-auto" onClick={onDelete}>
          Delete
        </SecondaryButton>
      )}

      {secondaryButton}
      <PrimaryButton
        disabled={!canSubmit}
        onClick={() => submitRef.current?.click()}
      >
        Save
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      footerButtons={footerButtons}
      onClose={onCancel}
      initialFocusRef={initialFocusRef}
    >
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {children}
        <button ref={submitRef} type="submit" className="sr-only">
          Save
        </button>
      </form>
    </Modal>
  );
};

export default FormModal;
