import { useEffect, useState } from "react";
import { fixGrammar, FixGrammarResponseData } from "../../api/review-functions";
import { useContextResume } from "../../AppShell";
import Card from "../../common/components/Card";
import SecondaryButton from "../../common/components/SecondaryButton";
import { buildRichDiff } from "../../common/functions/build-rich-diff";
import { getResumeStrings } from "../../common/functions/resume-utils";
import MetricCards from "./MetricCards";

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
        <div>
          <h3 className="mb-4 px-6 flex items-center gap-3">
            <span className="text-xl font-semibold">Writing style</span>
            <span className="py-1 px-3 rounded-full  text-white text-sm font-semibold bg-sky-500">
              {!!grammar?.corrections.length
                ? `${grammar?.corrections.length} corrections`
                : `All good`}
            </span>
          </h3>

          <div className="space-y-6">
            {grammar?.corrections.map(({ wrong, fixed }) => {
              const [wrongRich, fixedRich] = buildRichDiff(wrong, fixed);

              return (
                <div className="flex py-8 px-6 bg-neutral-50 items-center gap-6">
                  <SecondaryButton>Apply</SecondaryButton>

                  <div className="flex-grow flex flex-col gap-2 text-left">
                    <div className="text-gray-400">{wrongRich}</div>
                    <div className="font-medium">{fixedRich}</div>
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
