import { useEffect } from "react";
import { fixGrammar } from "../../api/review-functions";
import { useContextResume } from "../../AppShell";
import Card from "../../common/components/Card";
import PrimaryButton from "../../common/components/PrimaryButton";
import { getResumeStrings } from "../../common/functions/resume-utils";
import MetricCards from "./MetricCards";

const ReviewPage: React.FC = () => {
  const [resume] = useContextResume();

  useEffect(() => {
    if (resume === null) return;

    fixGrammar({
      strings: getResumeStrings(resume),
    })
      .then(console.log)
      .catch(console.error);
  }, [resume]);

  return (
    <div className="space-y-5">
      <MetricCards resume={resume} />

      <Card>
        <div className="text-center">
          <PrimaryButton>Start review</PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default ReviewPage;
