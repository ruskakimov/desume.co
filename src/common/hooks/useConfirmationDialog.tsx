import React, { useState } from "react";
import ConfirmationDialog, {
  ConfirmationDialogProps,
} from "../components/ConfirmationDialog";

type CallbackDialogProps = Omit<ConfirmationDialogProps, "isOpen">;

type PromiseDialogProps = Omit<
  ConfirmationDialogProps,
  "isOpen" | "onCancel" | "onConfirm"
>;

function _useCallbackConfirmationDialog(): [
  (props: CallbackDialogProps) => void,
  React.ReactNode
] {
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState<CallbackDialogProps | null>(null);

  const openDialog = (props: CallbackDialogProps) => {
    setProps(props);
    setOpen(true);
  };

  return [
    openDialog,
    <ConfirmationDialog
      isOpen={open}
      title={props?.title ?? ""}
      body={props?.body ?? ""}
      action={props?.action ?? ""}
      onCancel={() => {
        props?.onCancel();
        setOpen(false);
      }}
      onConfirm={() => {
        props?.onConfirm();
        setOpen(false);
      }}
    />,
  ];
}

export default function useConfirmationDialog(): [
  (props: PromiseDialogProps) => Promise<boolean>,
  React.ReactNode
] {
  const [openDialog, dialog] = _useCallbackConfirmationDialog();

  return [
    (props) =>
      new Promise((resolve) => {
        openDialog({
          ...props,
          onCancel: () => resolve(false),
          onConfirm: () => resolve(true),
        });
      }),
    dialog,
  ];
}
