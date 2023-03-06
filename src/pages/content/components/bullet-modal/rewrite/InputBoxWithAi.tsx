import { forwardRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { generateVariations } from "../../../../../api/bullet-functions";
import SecondaryButton from "../../../../../common/components/SecondaryButton";
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

    const isDirty = input.trim().length > 0;
    useEffect(() => onStateChange(isDirty), [isDirty]);

    const onGenerate = () => {
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
        });
    };

    return (
      <div ref={ref}>
        <InputBox
          value={input}
          onChange={setInput}
          onSubmit={() => {
            const formattedInput = fixFormat(input);
            onSubmit(formattedInput);
            setInput("");
          }}
        />
        <div className="-mt-4">
          <SecondaryButton onClick={onGenerate}>
            Generate with AI
          </SecondaryButton>
        </div>
      </div>
    );
  }
);

export default InputBoxWithAi;
