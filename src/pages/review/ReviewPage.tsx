import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  doc,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firestore } from "../../api/firebase-setup";
import { useUserContext } from "../../App";
import { useContextResume } from "../../AppShell";
import Card from "../../common/components/Card";
import ErrorBox from "../../common/components/ErrorBox";
import SecondaryButton from "../../common/components/SecondaryButton";
import { buildRichDiff } from "../../common/functions/build-rich-diff";
import { applyCorrection } from "../../common/functions/resume-utils";
import MetricCards from "./MetricCards";

export interface Correction {
  original: string;
  corrected: string;
}

interface Review {
  corrections: Correction[];
  correct: string[];
}

const converter: FirestoreDataConverter<Review> = {
  toFirestore(data: Review): DocumentData {
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Review {
    const data = snapshot.data();
    return data as Review;
  },
};

const ReviewPage: React.FC = () => {
  const [resume, setResume] = useContextResume();

  return (
    <div className="pb-8 space-y-5">
      <MetricCards resume={resume} />
      <WritingStyleSection
        onApply={(correction) => {
          if (resume) {
            setResume(applyCorrection(resume, correction));
          }
        }}
      />
    </div>
  );
};

const WritingStyleSection: React.FC<{
  onApply: (correction: Correction) => void;
}> = (props) => {
  const user = useUserContext();
  const [review, isLoading, error] = useDocumentData<Review>(
    doc(firestore, "reviews", user.uid).withConverter(converter)
  );

  if (isLoading) {
    return (
      <div className="h-40 shimmer bg-gray-200 rounded-md animate-pulse" />
    );
  }

  const buildContent = () => {
    if (error) {
      return (
        <div className="px-6">
          <ErrorBox title="Failed to load data." body={error.message} />
        </div>
      );
    }

    if (!review || review.corrections.length === 0) return null;

    return (
      <div className="space-y-6">
        {review?.corrections.map((correction) => {
          const [wrongRich, fixedRich] = buildRichDiff(
            correction.original,
            correction.corrected
          );

          return (
            <div className="mt-4 flex py-5 px-6 bg-gray-50 items-center gap-6">
              <SecondaryButton onClick={() => props.onApply(correction)}>
                Apply
              </SecondaryButton>

              <div className="flex-grow flex flex-col gap-2 text-left">
                <div className="font-medium">{fixedRich}</div>
                <div className="text-gray-400">{wrongRich}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card sidePadding={false}>
      <div>
        <h3 className="px-6 flex items-center gap-3">
          <span className="text-xl font-semibold">Writing style</span>
          {review && review.corrections.length > 0 ? (
            <span className="py-1 px-3 rounded-full text-white text-sm font-semibold bg-sky-500">
              {review.corrections.length} improvements
            </span>
          ) : (
            <CheckCircleIcon
              className="h-7 w-7 text-emerald-500"
              aria-hidden="true"
            />
          )}
        </h3>

        {buildContent()}
      </div>
    </Card>
  );
};

export default ReviewPage;
