import { useEffect, useState } from "react";
import { fixGrammar, FixGrammarResponseData } from "../../api/review-functions";
import { useContextResume } from "../../AppShell";
import Card from "../../common/components/Card";
import PrimaryButton from "../../common/components/PrimaryButton";
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
  const [grammar, setGrammar] = useState<FixGrammarResponseData | null>(
    dummyData
  );

  // useEffect(() => {
  //   if (resume === null) return;

  //   fixGrammar({
  //     strings: getResumeStrings(resume),
  //   })
  //     .then((res) => {
  //       setGrammar(res.data);
  //       console.log(JSON.stringify(res.data));
  //     })
  //     .catch(console.error);
  // }, [resume]);

  return (
    <div className="space-y-5">
      <MetricCards resume={resume} />

      <Card>
        <div className="text-center">
          {/* <PrimaryButton>Start review</PrimaryButton> */}

          <div className="space-y-6">
            {grammar?.corrections.map(({ wrong, fixed }) => {
              const [wrongRich, fixedRich] = buildRichDiff(wrong, fixed);

              return (
                <div className="grid grid-cols-2 border rounded divide-x">
                  <div className="p-4 bg-neutral-50">{wrongRich}</div>
                  <div className="p-4">{fixedRich}</div>
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
