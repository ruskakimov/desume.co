import { useEffect, useState } from "react";
import { fixGrammar, FixGrammarResponseData } from "../../api/review-functions";
import { useContextResume } from "../../AppShell";
import Card from "../../common/components/Card";
import PrimaryButton from "../../common/components/PrimaryButton";
import SecondaryButton from "../../common/components/SecondaryButton";
import { buildRichDiff } from "../../common/functions/build-rich-diff";
import { getResumeStrings } from "../../common/functions/resume-utils";
import MetricCards from "./MetricCards";

const dummyData = {
  corrections: [
    {
      fixed: "Washed the dog with dog shampoo. The dog is happy.",
      wrong: "Washed my dog with dog shampoo. Dog is happy.",
    },
    {
      fixed:
        "Feeding a dog through a sky full of lightning was successfully completed.",
      wrong:
        "Task of a feeding dog through sky full of lightings was successfully completed.",
    },
    {
      fixed: "Blah blah blah blah blah blah blah blah blah blah blah.",
      wrong: "Blah blah blah blah blah blah blah blah blah blah blah.",
    },
  ],
};

const ReviewPage: React.FC = () => {
  const [resume] = useContextResume();
  const [grammar, setGrammar] = useState<FixGrammarResponseData | null>(null);

  useEffect(() => {
    if (resume === null) return;

    fixGrammar({
      strings: getResumeStrings(resume),
    })
      .then((res) => {
        setGrammar(res.data);
        console.log(JSON.stringify(res.data));
      })
      .catch(console.error);
  }, [resume]);

  return (
    <div className="space-y-5">
      <MetricCards resume={resume} />

      <Card sidePadding={false}>
        {/* <PrimaryButton>Start review</PrimaryButton> */}

        <div>
          <h3 className="mb-4 px-6 text-xl font-semibold">
            {grammar?.corrections.length} grammar/spelling errors
          </h3>

          <div className="space-y-6">
            {grammar?.corrections.map(({ wrong, fixed }) => {
              const [wrongRich, fixedRich] = buildRichDiff(wrong, fixed);

              return (
                <div className="flex py-4 px-6 bg-neutral-50 items-center gap-6">
                  <SecondaryButton>Fix</SecondaryButton>

                  <div className="flex-grow flex flex-col gap-2 text-left">
                    <div className="text-gray-400">{wrongRich}</div>
                    <div className="bg-neutral-50">{fixedRich}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReviewPage;
