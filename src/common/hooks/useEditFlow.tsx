import { useRef, useState } from "react";
import { userCancelReason } from "../constants/reject-reasons";
import useConfirmationDialog from "./useConfirmationDialog";
import useDiscardChangesDialog from "./useDiscardChangesDialog";

export interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void; // TODO: Rename to cancel
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

export default function useEditFlow<T>(): {
  openEditDialog: () => Promise<T | null>;
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

  // TODO: Pass 'hasDelete' option
  const openEditDialog = (
    onResolve: ResolveCallback<T>,
    onReject: RejectCallback
  ) => {
    resolveCallbackRef.current = onResolve;
    rejectCallbackRef.current = onReject;
    setIsOpen(true);
  };

  return {
    openEditDialog: () =>
      new Promise((resolve, reject) => openEditDialog(resolve, reject)),
    buildDialogProps: ({
      titleName,
      getData,
      getIsValid,
      getIsDirty,
      getDeleteName,
    }) => ({
      isOpen,
      onClose: async () => {
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
      onDelete: async () => {
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
      },
    }),
    confirmationPopups: (
      <>
        {discardConfirmationDialog}
        {deleteConfirmationDialog}
      </>
    ),
  };
}
