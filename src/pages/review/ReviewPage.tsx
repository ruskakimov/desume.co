import { useContextResume } from "../../AppShell";
import Card from "../../common/components/Card";
import PrimaryButton from "../../common/components/PrimaryButton";
import MetricCards from "./MetricCards";

const ReviewPage: React.FC = () => {
  const [resume] = useContextResume();

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
