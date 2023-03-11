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
    { name: "Word Count", stat: resume ? calcResumeWordCount(resume) : 0 },
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

function calcResumeWordCount(resume: Resume): number {
  let total = 0;

  total += calcWordCount(resume.personalDetails.fullName);
  total += calcWordCount(resume.personalDetails.location);
  total += calcWordCount(resume.personalDetails.title);

  for (const skillGroup of resume.skillGroups) {
    if (!skillGroup.included) continue;

    total += calcWordCount(skillGroup.groupName);

    for (const skill of skillGroup.skills) {
      if (!skill.included) continue;
      total += calcWordCount(skill.text);
    }
  }

  for (const workExp of resume.workHistory) {
    if (!workExp.included) continue;

    total += calcWordCount(workExp.companyName);
    total += calcWordCount(workExp.jobTitle);

    for (const bullet of workExp.bulletPoints) {
      if (!bullet.included) continue;
      total += calcWordCount(bullet.text);
    }
  }

  for (const education of resume.educationHistory) {
    if (!education.included) continue;

    total += calcWordCount(education.schoolName);
    total += calcWordCount(education.degree);

    for (const bullet of education.bulletPoints) {
      if (!bullet.included) continue;
      total += calcWordCount(bullet.text);
    }
  }

  for (const project of resume.projectHistory) {
    if (!project.included) continue;

    total += calcWordCount(project.projectName);

    for (const bullet of project.bulletPoints) {
      if (!bullet.included) continue;
      total += calcWordCount(bullet.text);
    }
  }

  return total;
}

function calcWordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export default MetricCards;
