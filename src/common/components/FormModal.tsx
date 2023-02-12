import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { EditDialogProps } from "../hooks/useEditFlow";

interface FormModalProps extends EditDialogProps {
  children: React.ReactNode;
  secondaryButton?: React.ReactNode;
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
  initialFocusRef,
  canSubmit,
}) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onCancel}
        initialFocus={initialFocusRef}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="flex h-full max-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl h-full sm:h-auto">
                <form
                  className="h-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                  }}
                >
                  <div className="flex h-full sm:max-h-[calc(100vh-6rem)] flex-col divide-y divide-gray-200 bg-white sm:shadow-xl sm:rounded-lg">
                    <div className="flex items-start justify-between px-4 sm:px-6 py-4">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {title}
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 no-mouse-focus-ring"
                          onClick={onCancel}
                        >
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="relative flex-1 px-4 sm:px-6">
                        {children}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end gap-4 px-4 sm:px-6 py-4">
                      {onDelete && (
                        <SecondaryButton
                          className="text-red-600 mr-auto"
                          onClick={onDelete}
                        >
                          Delete
                        </SecondaryButton>
                      )}

                      {secondaryButton}
                      <PrimaryButton disabled={!canSubmit} type="submit">
                        Save
                      </PrimaryButton>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default FormModal;
