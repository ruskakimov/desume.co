import ShimmerOverlay from "../../common/components/ShimmerOverlay";
import {
  calcResumeBulletCount,
  calcResumeWordCount,
  calcYearsOfExp,
} from "../../common/functions/resume-utils";
import { Resume } from "../../common/interfaces/resume";

interface Props {
  resume: Resume | null;
}

const MetricCards: React.FC<Props> = ({ resume }) => {
  const stats = [
    {
      name: "Years of Experience",
      stat: resume ? calcYearsOfExp(resume).toFixed(0) : 0,
    },
    { name: "Word Count", stat: resume ? calcResumeWordCount(resume) : 0 },
    { name: "Bullet Count", stat: resume ? calcResumeBulletCount(resume) : 0 },
  ];

  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((item) => (
        <ShimmerOverlay className="rounded-lg" loading={resume === null}>
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.stat}
            </dd>
          </div>
        </ShimmerOverlay>
      ))}
    </dl>
  );
};

export default MetricCards;
