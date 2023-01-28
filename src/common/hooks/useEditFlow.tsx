import { useRef, useState } from "react";
import { userCancelReason } from "../constants/reject-reasons";
import useConfirmationDialog from "./useConfirmationDialog";
import useDiscardChangesDialog from "./useDiscardChangesDialog";

export interface EditDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
}

type ResolveCallback<T> = (data: T | null) => void;
type RejectCallback = (reason: string) => void;

interface DialogBuilderOptions<T> {
  titleName: string;
  getIsValid: () => Promise<boolean>;
  getIsDirty: () => boolean;
  getData: () => T;
  getDeleteName: () => string;
}

type DialogPropsBuilder<T> = (
  options: DialogBuilderOptions<T>
) => EditDialogProps;

interface DialogOptions {
  hasDelete: boolean;
}

export default function useEditFlow<T>(): {
  openEditDialog: (options: DialogOptions) => Promise<T | null>;
  buildDialogProps: DialogPropsBuilder<T>;
  confirmationPopups: React.ReactNode;
} {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDelete, setHasDelete] = useState(true);
  const resolveCallbackRef = useRef<ResolveCallback<T> | null>(null);
  const rejectCallbackRef = useRef<RejectCallback | null>(null);

  const [openConfirmationDialog, deleteConfirmationDialog] =
    useConfirmationDialog();
  const [getDiscardConfirmation, discardConfirmationDialog] =
    useDiscardChangesDialog();

  const openEditDialog = (
    options: DialogOptions,
    onResolve: ResolveCallback<T>,
    onReject: RejectCallback
  ) => {
    resolveCallbackRef.current = onResolve;
    rejectCallbackRef.current = onReject;
    setIsOpen(true);
    setHasDelete(options.hasDelete);
  };

  return {
    openEditDialog: (options) =>
      new Promise((resolve, reject) =>
        openEditDialog(options, resolve, reject)
      ),
    buildDialogProps: ({
      titleName,
      getData,
      getIsValid,
      getIsDirty,
      getDeleteName,
    }) => ({
      isOpen,
      onCancel: async () => {
        if (!getIsDirty() || (await getDiscardConfirmation())) {
          rejectCallbackRef.current?.(userCancelReason);
          setIsOpen(false);
        }
      },
      onSubmit: async () => {
        if (await getIsValid()) {
          resolveCallbackRef.current?.(getData());
          setIsOpen(false);
        }
      },
      onDelete: hasDelete
        ? async () => {
            const confirmed = await openConfirmationDialog({
              title: `Delete ${titleName}`,
              body: (
                <p className="text-sm text-gray-500">
                  Delete <b>{getDeleteName()}</b>? This action cannot be undone.
                </p>
              ),
              action: "Delete",
            });

            if (confirmed) {
              resolveCallbackRef.current?.(null);
              setIsOpen(false);
            }
          }
        : undefined,
    }),
    confirmationPopups: (
      <>
        {discardConfirmationDialog}
        {deleteConfirmationDialog}
      </>
    ),
  };
}
