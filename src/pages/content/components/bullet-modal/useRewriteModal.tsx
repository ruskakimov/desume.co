import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { useLayoutEffect, useRef, useState } from "react";
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

type RewriteStep = "generate-variants" | "select-variant";

const rewriteStepTitles: Record<RewriteStep, string> = {
  "generate-variants": "brainstorm",
  "select-variant": "select a winner",
};

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
    setStep("generate-variants");
    setInput("");
    setVariants([bullet.text]);
    setSelectedVariant("");
  };

  const [step, setStep] = useState<RewriteStep>("generate-variants");

  const [variants, setVariants] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLDivElement | null>(null);

  const [selectedVariant, setSelectedVariant] = useState("");

  useLayoutEffect(() => {
    inputRef.current?.scrollIntoView();
  }, [variants]);

  const onVariantSubmit = () => {
    const formattedInput = fixFormat(input);
    if (formattedInput.length === 0) return;

    setVariants([...variants, formattedInput]);
    setInput("");
  };

  const generateStepButtons = (
    <>
      <PrimaryButton
        disabled={variants.length < 2}
        onClick={() => setStep("select-variant")}
      >
        Next
      </PrimaryButton>
    </>
  );

  const selectStepButtons = (
    <>
      <SecondaryButton
        className="mr-auto"
        onClick={() => setStep("generate-variants")}
      >
        Back to brainstorming
      </SecondaryButton>
      <PrimaryButton disabled={selectedVariant === ""} onClick={() => {}}>
        Save selected
      </PrimaryButton>
    </>
  );

  const generateStepUi = (
    <div className="space-y-6">
      <AiTextBubble>
        This is a good accomplishment, but you could make it even stronger by
        including metrics such as the percentage increase in user engagement,
        customer satisfaction, or customer retention that resulted from the
        profile editor. You could also add metrics about the time saved or the
        cost savings associated with the profile editor.
      </AiTextBubble>

      <div className="grid grid-cols-[1.75rem_1fr] gap-y-3 text-sm">
        {variants.map((text, index) => (
          <>
            <div className="text-gray-400">{index + 1}.</div>
            <div>{text}</div>
          </>
        ))}
      </div>

      <SecondaryButton>Generate variations</SecondaryButton>

      <div ref={inputRef}>
        <InputBox
          value={input}
          onChange={setInput}
          onSubmit={onVariantSubmit}
        />
      </div>
    </div>
  );

  const selectStepUi = (
    <div className="space-y-6">
      {/* <AiTextBubble>Hold on, I am ranking your variants...</AiTextBubble> */}
      <AiTextBubble>Here is how I would rank them.</AiTextBubble>

      <div className="space-y-4">
        {variants.map((text, index) => (
          <div
            className={classNames(
              "p-4 border rounded-md flex gap-3 items-center cursor-pointer",
              {
                "ring-2 ring-gray-600": text === selectedVariant,
                "opacity-50":
                  text !== selectedVariant && selectedVariant !== "",
              }
            )}
            onClick={() => setSelectedVariant(text)}
          >
            <div className="h-7 w-7 rounded-full bg-sky-500 flex-shrink-0 flex justify-center items-center">
              <span className="text-white font-bold">{index + 1}</span>
            </div>
            <span className="text-sm">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return [
    (bullet) =>
      new Promise((resolve, reject) => openModal(bullet, resolve, reject)),
    <Modal
      title={`Rewrite: ${rewriteStepTitles[step]}`}
      isOpen={isOpen}
      onClose={() => {
        rejectCallbackRef.current?.(userCancelReason);
        setIsOpen(false);
      }}
      footerButtons={
        step === "generate-variants" ? generateStepButtons : selectStepButtons
      }
    >
      {step === "generate-variants" ? generateStepUi : selectStepUi}
    </Modal>,
  ];
}

const AiTextBubble: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2">
      <div className="h-8 w-8 flex justify-center items-center text-sm text-white font-bold tracking-wide bg-sky-500 rounded-full mt-2.5">
        AI
      </div>
      <p className="text-sm p-4 bg-sky-50 rounded-md text-sky-900">
        {props.children}
      </p>
    </div>
  );
};

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
