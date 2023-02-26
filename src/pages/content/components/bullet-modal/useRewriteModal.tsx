import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import TextAreaField from "../../../../common/components/fields/TextAreaField";
import Modal from "../../../../common/components/Modal";
import PrimaryButton from "../../../../common/components/PrimaryButton";
import SecondaryButton from "../../../../common/components/SecondaryButton";
import { userCancelReason } from "../../../../common/constants/reject-reasons";
import { BulletPoint } from "../../../../common/interfaces/resume";
import { fixFormat } from "./format";
import { bulletMaxLength } from "./useBulletModal";

type OpenRewriteModal = (bullet: BulletPoint) => Promise<BulletPoint>;

type ResolveCallback = (bullet: BulletPoint) => void;
type RejectCallback = (reason: string) => void;

export default function useRewriteModal(): [OpenRewriteModal, React.ReactNode] {
  const [isOpen, setIsOpen] = useState(false);

  const resolveCallbackRef = useRef<ResolveCallback | null>(null);
  const rejectCallbackRef = useRef<RejectCallback | null>(null);

  const openModal = (
    bullet: BulletPoint,
    onResolve: ResolveCallback,
    onReject: RejectCallback
  ) => {
    resolveCallbackRef.current = onResolve;
    rejectCallbackRef.current = onReject;
    setIsOpen(true);
    setInput("");
    setVariants([bullet.text]);
  };

  const [variants, setVariants] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const onSubmit = () => {
    const formattedInput = fixFormat(input);
    if (formattedInput.length === 0) return;

    setVariants([...variants, formattedInput]);
    setInput("");
  };

  return [
    (bullet) =>
      new Promise((resolve, reject) => openModal(bullet, resolve, reject)),
    <Modal
      title="Rewrite: brainstorm"
      isOpen={isOpen}
      onClose={() => {
        rejectCallbackRef.current?.(userCancelReason);
        setIsOpen(false);
      }}
      footerButtons={
        <>
          <PrimaryButton>Next</PrimaryButton>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <div className="h-8 w-8 flex justify-center items-center text-xl rounded-full bg-neutral-100 mt-4">
            🤓
          </div>
          <p className="text-sm p-4 bg-neutral-50 rounded text-gray-600">
            This is a good accomplishment, but you could make it even stronger
            by including metrics such as the percentage increase in user
            engagement, customer satisfaction, or customer retention that
            resulted from the profile editor. You could also add metrics about
            the time saved or the cost savings associated with the profile
            editor. Additionally, you could include details about the scale of
            the user base (e.g. international, national, or regional).
          </p>
        </div>

        <div className="grid grid-cols-[1.75rem_1fr] gap-y-3 text-sm">
          {variants.map((text, index) => (
            <>
              <div className="text-gray-400">{index + 1}.</div>
              <div>{text}</div>
            </>
          ))}
        </div>

        <SecondaryButton>Generate variations</SecondaryButton>

        <InputBox value={input} onChange={setInput} onSubmit={onSubmit} />
      </div>
    </Modal>,
  ];
}

const InputBox: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}> = (props) => {
  return (
    <div>
      <div className="relative">
        <TextAreaField
          label="Write a variation"
          rows={3}
          maxLength={bulletMaxLength}
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              e.preventDefault();
              props.onSubmit();
            }
          }}
          style={{ paddingRight: 52 }}
        />
        <button
          className="absolute top-6 right-0 p-2 m-2 rounded bg-gray-100"
          type="button"
          onClick={props.onSubmit}
        >
          <PaperAirplaneIcon className="h-5" />
        </button>
      </div>

      <div className="mt-2 flex justify-end text-sm text-gray-500">
        <span className="text-gray-900">
          {props.value.length}
          <span className="text-gray-500">/{bulletMaxLength}</span>
        </span>
      </div>
    </div>
  );
};
