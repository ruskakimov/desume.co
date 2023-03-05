import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  generateVariations,
  scoreVariations,
  suggestImprovements,
} from "../../../../api/bullet-functions";
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
    setSuggestion("Hold on, I am reviewing your bullet point...");

    suggestImprovements({ bulletPoint: bullet.text })
      .then((res) => setSuggestion(res.data.suggestion))
      .catch((e) => {
        console.error(e);
        setSuggestion("Oops, something went wrong.");
      });
  };

  const [step, setStep] = useState<RewriteStep>("generate-variants");

  const [suggestion, setSuggestion] = useState("");

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

  const onGenerate = () => {
    generateVariations({ bulletPoint: variants[0], variationCount: 1 })
      .then((res) => {
        const { variations } = res.data;
        setInput(variations[0]);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Generation failed.");
      });
  };

  const generateStepButtons = (
    <>
      <div className="flex items-center gap-3">
        {input.trim() !== "" && (
          <p className="text-sm text-gray-500">Submit or delete your input</p>
        )}
        <PrimaryButton
          disabled={variants.length < 2 || input.trim() !== ""}
          onClick={() => setStep("select-variant")}
        >
          Score submissions
        </PrimaryButton>
      </div>
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
      <AiTextBubble>{suggestion}</AiTextBubble>

      <div className="grid grid-cols-[auto_1fr] gap-3 text-sm leading-normal">
        {variants.map((text) => (
          <>
            <div>&bull;</div>
            <div>{text}</div>
          </>
        ))}
      </div>

      {variants.length >= 10 ? (
        <AiTextBubble>
          Great job! You have reached the maximum number of submissions.
          <br />
          Let's proceed to the next step.
        </AiTextBubble>
      ) : (
        <div>
          <div ref={inputRef}>
            <InputBox
              value={input}
              onChange={setInput}
              onSubmit={onVariantSubmit}
            />
          </div>
          <div className="-mt-4">
            <SecondaryButton onClick={onGenerate}>
              Generate with AI
            </SecondaryButton>
          </div>
        </div>
      )}
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
      {step === "generate-variants" ? (
        generateStepUi
      ) : (
        <SelectionStep
          variants={variants}
          selected={selectedVariant}
          onChange={setSelectedVariant}
        />
      )}
    </Modal>,
  ];
}

const SelectionStep: React.FC<{
  variants: string[];
  selected: string;
  onChange: (selected: string) => void;
}> = (props) => {
  const [scoredVariants, setScoredVariants] = useState<
    { variant: string; score: number }[] | null
  >(null);

  useEffect(() => {
    scoreVariations({ variations: props.variants })
      .then((res) => {
        const scored = res.data.scores
          .map((score, index) => ({
            variant: props.variants[index],
            score,
          }))
          .sort((a, b) => b.score - a.score);
        setScoredVariants(scored);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Scoring failed.");
      });
  }, [props.variants]);

  const isLoading = scoredVariants === null;

  return (
    <div className="space-y-6">
      <AiTextBubble
        children={
          isLoading
            ? "Hold on, I am scoring your submissions..."
            : "Done! Here is how I would score your submissions. Now, you need to pick the one you want to use in your resume."
        }
      />

      <div className="space-y-4">
        {scoredVariants?.map(({ score, variant }, index) => (
          <div
            className={classNames(
              "p-4 border rounded-md flex gap-3 items-center cursor-pointer",
              {
                "ring-2 ring-gray-600": variant === props.selected,
                "opacity-50":
                  variant !== props.selected && props.selected !== "",
              }
            )}
            onClick={() => props.onChange(variant)}
          >
            <div
              className={classNames(
                "h-7 w-7 rounded-full flex-shrink-0 flex justify-center items-center",
                {
                  "bg-emerald-500": score >= 9,
                  "bg-lime-500": score === 8 || score === 7,
                  "bg-yellow-500": score === 6 || score === 5,
                  "bg-orange-500": score === 4 || score === 3,
                  "bg-red-500": score <= 2,
                }
              )}
            >
              <span className="text-white font-bold">{score}</span>
            </div>
            <span className="text-sm">{variant}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AiTextBubble: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2">
      <div className="h-8 w-8 flex justify-center items-center text-sm text-white font-bold tracking-wide bg-sky-500 rounded-full mt-2.5">
        AI
      </div>
      <p className="text-sm p-4 bg-sky-50 rounded-md text-sky-900 leading-normal">
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
