import { forwardRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { generateVariations } from "../../../../../api/bullet-functions";
import SecondaryButton from "../../../../../common/components/SecondaryButton";
import Spinner from "../../../../../common/components/Spinner";
import { fixFormat } from "../format";
import InputBox from "./InputBox";

interface Props {
  originalBulletPoint: string;
  onSubmit: (variant: string) => void;
  onStateChange: (isDirty: boolean) => void;
}

const InputBoxWithAi = forwardRef<HTMLDivElement, Props>(
  ({ originalBulletPoint, onSubmit, onStateChange }, ref) => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isDirty = input.trim().length > 0 || isLoading;
    useEffect(() => onStateChange(isDirty), [isDirty]);

    const onGenerate = () => {
      setInput("");
      setIsLoading(true);
      generateVariations({
        bulletPoint: originalBulletPoint,
        variationCount: 1,
      })
        .then((res) => {
          const { variations } = res.data;
          setInput(variations[0]);
        })
        .catch((e) => {
          console.error(e);
          toast.error("Generation failed.");
        })
        .finally(() => setIsLoading(false));
    };

    return (
      <div ref={ref}>
        <div className="relative">
          <InputBox
            value={input}
            disabled={isLoading}
            onChange={setInput}
            onSubmit={() => {
              const formattedInput = fixFormat(input);
              if (formattedInput.length > 0) {
                onSubmit(formattedInput);
                setInput("");
              }
            }}
          />
          {isLoading && (
            <div className="absolute inset-0 -mt-1 flex justify-center items-center">
              <Spinner shade="dark" />
            </div>
          )}
        </div>
        <div className="-mt-4 relative z-10">
          <SecondaryButton disabled={isLoading} onClick={onGenerate}>
            Generate with AI
          </SecondaryButton>
        </div>
      </div>
    );
  }
);

export default InputBoxWithAi;
