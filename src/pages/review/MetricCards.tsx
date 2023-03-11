import ShimmerOverlay from "../../common/components/ShimmerOverlay";
import { Experience, Resume } from "../../common/interfaces/resume";

interface Props {
  resume: Resume | null;
}

const MetricCards: React.FC<Props> = ({ resume }) => {
  const stats = [
    {
      name: "Years of Experience",
      stat: resume ? calcYearsOfExp(resume).toFixed(0) : 0,
    },
    { name: "Word Count", stat: "345" },
    { name: "Bullet Count", stat: "24" },
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

function calcYearsOfExp(resume: Resume): number {
  return resume.workHistory.reduce(
    (total, workExp) => total + calcExpYears(workExp),
    0
  );
}

function calcExpYears(exp: Experience): number {
  const endDate = exp.endDate ?? {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };

  const monthDiff =
    endDate.year * 12 +
    endDate.month -
    exp.startDate.year * 12 -
    exp.startDate.month +
    1;

  return monthDiff / 12;
}

export default MetricCards;
