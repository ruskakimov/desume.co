import React, { useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { suggestImprovements } from "../../../../../api/bullet-functions";
import Modal from "../../../../../common/components/Modal";
import PrimaryButton from "../../../../../common/components/PrimaryButton";
import { userCancelReason } from "../../../../../common/constants/reject-reasons";
import useDiscardChangesDialog from "../../../../../common/hooks/useDiscardChangesDialog";
import { BulletPoint } from "../../../../../common/interfaces/resume";
import AiTextBubble from "./AiTextBubble";
import InputBoxWithAi from "./InputBoxWithAi";
import SelectionStep from "./SelectionStep";

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
    originalBullet.current = bullet;
    resolveCallbackRef.current = onResolve;
    rejectCallbackRef.current = onReject;
    setIsOpen(true);
    setStep("generate-variants");
    setVariants([bullet.text]);
    setSelectedVariant("");
    setSuggestion("Hold on, I am reviewing your bullet point...");

    suggestImprovements({ bulletPoint: bullet.text })
      .then((res) => setSuggestion(res.data.suggestion))
      .catch((e) => {
        console.error(e);
        setSuggestion("Oops, something went wrong.");
      });
  };

  const originalBullet = useRef<BulletPoint | null>(null);

  const [step, setStep] = useState<RewriteStep>("generate-variants");

  const [suggestion, setSuggestion] = useState("");

  const [variants, setVariants] = useState<string[]>([]);

  const [selectedVariant, setSelectedVariant] = useState("");

  const inputRef = useRef<HTMLDivElement | null>(null);
  const [isInputDirty, setIsInputDirty] = useState(false);

  const [getDiscardConfirmation, discardConfirmationDialog] =
    useDiscardChangesDialog();

  useLayoutEffect(() => {
    inputRef.current?.scrollIntoView();
  }, [variants]);

  const onVariantSubmit = (variant: string) => {
    if (variants.includes(variant)) {
      toast.error("Cannot submit duplicates.");
      return;
    }
    setVariants([...variants, variant]);
  };

  const onSave = () => {
    resolveCallbackRef.current?.({
      ...originalBullet.current!,
      text: selectedVariant,
    });
    setIsOpen(false);
  };

  const onClose = async () => {
    if (await getDiscardConfirmation()) {
      rejectCallbackRef.current?.(userCancelReason);
      setIsOpen(false);
    }
  };

  const generateStepButtons = (
    <>
      <div className="flex items-center gap-3">
        {isInputDirty && (
          <p className="text-sm text-gray-500">Submit or delete your input</p>
        )}
        <PrimaryButton
          disabled={variants.length < 2 || isInputDirty}
          onClick={() => setStep("select-variant")}
        >
          Score submissions
        </PrimaryButton>
      </div>
    </>
  );

  const selectStepButtons = (
    <>
      <PrimaryButton disabled={selectedVariant === ""} onClick={onSave}>
        Save selected
      </PrimaryButton>
    </>
  );

  const generateStepUi = (
    <div className="space-y-6">
      <AiTextBubble text={suggestion} />

      <div className="grid grid-cols-[auto_1fr] gap-3 text-sm leading-normal">
        {variants.map((text) => (
          <>
            <div>&bull;</div>
            <div>{text}</div>
          </>
        ))}
      </div>

      {variants.length >= 10 ? (
        <AiTextBubble text="Great job! You have reached the maximum number of submissions. Let's proceed to the next step." />
      ) : (
        <InputBoxWithAi
          ref={inputRef}
          originalBulletPoint={variants[0]}
          onSubmit={onVariantSubmit}
          onStateChange={setIsInputDirty}
        />
      )}
    </div>
  );

  return [
    (bullet) =>
      new Promise((resolve, reject) => openModal(bullet, resolve, reject)),
    <Modal
      title={`Rewrite: ${rewriteStepTitles[step]}`}
      isOpen={isOpen}
      onClose={onClose}
      footerButtons={
        step === "generate-variants" ? generateStepButtons : selectStepButtons
      }
    >
      {step === "generate-variants" ? (
        generateStepUi
      ) : (
        <SelectionStep
          variants={variants}
          selected={selectedVariant}
          onChange={setSelectedVariant}
        />
      )}
      {discardConfirmationDialog}
    </Modal>,
  ];
}
