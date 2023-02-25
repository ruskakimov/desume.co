import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import TextAreaField from "../../../../common/components/fields/TextAreaField";
import FormModal from "../../../../common/components/FormModal";
import { userCancelReason } from "../../../../common/constants/reject-reasons";
import { BulletPoint } from "../../../../common/interfaces/resume";
import { bulletMaxLength } from "./useBulletModal";

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

  const [input, setInput] = useState("");

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
      <div className="relative">
        <TextAreaField
          label="Write a variation"
          rows={3}
          maxLength={bulletMaxLength}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              e.preventDefault();
            }
          }}
          style={{ paddingRight: 52 }}
        />
        <button
          className="absolute top-6 right-0 p-2 m-2 rounded bg-gray-100"
          type="button"
        >
          <PaperAirplaneIcon className="h-5" />
        </button>
      </div>

      <div className="mt-2 flex justify-end text-sm text-gray-500">
        {/* <span>Press Enter to submit</span> */}
        <span className="text-gray-900">
          {input.length}
          <span className="text-gray-500">/{bulletMaxLength}</span>
        </span>
      </div>
    </FormModal>,
  ];
}
