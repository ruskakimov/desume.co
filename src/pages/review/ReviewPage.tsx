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
import MetricCards from "./MetricCards";

interface Review {
  corrections: { original: string; corrected: string }[];
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
  const [resume] = useContextResume();

  return (
    <div className="pb-8 space-y-5">
      <MetricCards resume={resume} />
      <WritingStyleSection />
    </div>
  );
};

const WritingStyleSection: React.FC = () => {
  const user = useUserContext();
  const [review, isLoading, error] = useDocumentData<Review>(
    doc(firestore, "reviews", user.uid).withConverter(converter)
  );

  if (isLoading) {
    return (
      <div className="h-40 shimmer bg-gray-200 rounded-md animate-pulse" />
    );
  }

  return (
    <Card sidePadding={false}>
      <div>
        <h3 className="mb-4 px-6 flex items-center gap-3">
          <span className="text-xl font-semibold">Writing style</span>
          {review && review.corrections.length > 0 ? (
            <span className="py-1 px-3 rounded-full text-white text-sm font-semibold bg-sky-500">
              {review.corrections.length} improvements
            </span>
          ) : null}
        </h3>

        {error ? (
          <div className="px-6">
            <ErrorBox title="Failed to load data." body={error.message} />
          </div>
        ) : (
          <div className="space-y-6">
            {review?.corrections.map(({ original, corrected }) => {
              const [wrongRich, fixedRich] = buildRichDiff(original, corrected);

              return (
                <div className="flex py-5 px-6 bg-gray-50 items-center gap-6">
                  <SecondaryButton>Apply</SecondaryButton>

                  <div className="flex-grow flex flex-col gap-2 text-left">
                    <div className="font-medium">{fixedRich}</div>
                    <div className="text-gray-400">{wrongRich}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReviewPage;
