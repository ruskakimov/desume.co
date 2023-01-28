import { useRef, useState } from "react";
import { userCancelReason } from "../constants/reject-reasons";
import useConfirmationDialog from "./useConfirmationDialog";
import useDiscardChangesDialog from "./useDiscardChangesDialog";

export interface EditDialogueProps {
  isOpen: boolean;
  onClose: () => void; // TODO: Rename to cancel
  onSubmit: () => void;
  onDelete?: () => void;
}

type ResolveCallback<T> = (data: T | null) => void;
type RejectCallback = (reason: string) => void;

interface DialogueBuilderOptions<T> {
  titleName: string;
  getIsValid: () => Promise<boolean>;
  getIsDirty: () => boolean;
  getData: () => T;
  getDeleteName: () => string;
}

type DialoguePropsBuilder<T> = (
  options: DialogueBuilderOptions<T>
) => EditDialogueProps;

export default function useEditFlow<T>(): [
  () => Promise<T | null>,
  DialoguePropsBuilder<T>,
  React.ReactNode
] {
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

  return [
    () => new Promise((resolve, reject) => openEditDialog(resolve, reject)),
    ({ titleName, getData, getIsValid, getIsDirty, getDeleteName }) => ({
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
    <>
      {discardConfirmationDialog}
      {deleteConfirmationDialog}
    </>,
  ];
}
