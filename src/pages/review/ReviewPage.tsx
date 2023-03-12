import { useEffect } from "react";
import { fixGrammar } from "../../api/review-functions";
import { useContextResume } from "../../AppShell";
import Card from "../../common/components/Card";
import PrimaryButton from "../../common/components/PrimaryButton";
import MetricCards from "./MetricCards";

const ReviewPage: React.FC = () => {
  const [resume] = useContextResume();

  useEffect(() => {
    fixGrammar({
      strings: [
        "Rustem Kakimov",
        "He iz very good boi",
        "Completed to research projects with 90% satifaction rate.",
      ],
    })
      .then(console.log)
      .catch(console.error);
  }, []);

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
