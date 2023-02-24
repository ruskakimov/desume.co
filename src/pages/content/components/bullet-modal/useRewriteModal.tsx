import { useRef, useState } from "react";
import FormModal from "../../../../common/components/FormModal";
import { userCancelReason } from "../../../../common/constants/reject-reasons";
import { BulletPoint } from "../../../../common/interfaces/resume";

type OpenRewriteModal = (bullet: BulletPoint) => Promise<BulletPoint>;

type ResolveCallback = (bullet: BulletPoint) => void;
type RejectCallback = (reason: string) => void;

export default function useRewriteModal(): [OpenRewriteModal, React.ReactNode] {
  const [isOpen, setIsOpen] = useState(false);

  const resolveCallbackRef = useRef<ResolveCallback | null>(null);
  const rejectCallbackRef = useRef<RejectCallback | null>(null);

  const openModal = (onResolve: ResolveCallback, onReject: RejectCallback) => {
    resolveCallbackRef.current = onResolve;
    rejectCallbackRef.current = onReject;
    setIsOpen(true);
  };

  return [
    () => new Promise((resolve, reject) => openModal(resolve, reject)),
    // TODO: Use a custom version where we control the buttons
    <FormModal
      title="Rewrite: brainstorm"
      isOpen={isOpen}
      canSubmit={false}
      onCancel={() => {
        rejectCallbackRef.current?.(userCancelReason);
        setIsOpen(false);
      }}
      onSubmit={() => {
        // TODO: Get final selection
        // resolveCallbackRef.current?.(getData());
        setIsOpen(false);
      }}
    >
      <div></div>
    </FormModal>,
  ];
}
