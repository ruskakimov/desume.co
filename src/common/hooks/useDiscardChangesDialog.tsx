import useConfirmationDialog from "./useConfirmationDialog";

export default function useDiscardChangesDialog(): [
  () => Promise<boolean>,
  React.ReactNode
] {
  const [openConfirmationDialog, confirmationDialog] = useConfirmationDialog();

  return [
    () =>
      openConfirmationDialog({
        title: "Discard changes",
        body: (
          <p className="text-sm text-gray-500">
            Are you sure you want to discard the changes you made?
          </p>
        ),
        action: "Discard",
      }),
    confirmationDialog,
  ];
}
