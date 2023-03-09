import classNames from "classnames";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { scoreVariations } from "../../../../../api/bullet-functions";
import AiTextBubble from "./AiTextBubble";

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
        text={
          isLoading
            ? "Hold on, I am scoring your submissions..."
            : "Done! Here is how I would score your submissions. Now, you need to select the one you want to use in your resume."
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

export default SelectionStep;
