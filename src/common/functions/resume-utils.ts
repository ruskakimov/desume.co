import { Experience, Resume, ResumeSectionId } from "../interfaces/resume";

export function calcYearsOfExp(resume: Resume): number {
  return resume.workHistory.reduce(
    (total, workExp) => total + calcExpYears(workExp),
    0
  );
}

function calcExpYears(exp: Experience): number {
  if (!exp.included) return 0;

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

export function calcResumeWordCount(resume: Resume): number {
  let total = 0;

  if (resumeContainsSection(resume, "personal")) {
    total += calcWordCount(resume.personalDetails.fullName);
    total += calcWordCount(resume.personalDetails.location);
    total += calcWordCount(resume.personalDetails.title);
  }

  if (resumeContainsSection(resume, "skills")) {
    for (const skillGroup of resume.skillGroups) {
      if (!skillGroup.included) continue;

      total += calcWordCount(skillGroup.groupName);

      for (const skill of skillGroup.skills) {
        if (!skill.included) continue;
        total += calcWordCount(skill.text);
      }
    }
  }

  if (resumeContainsSection(resume, "work")) {
    for (const workExp of resume.workHistory) {
      if (!workExp.included) continue;

      total += calcWordCount(workExp.companyName);
      total += calcWordCount(workExp.jobTitle);

      for (const bullet of workExp.bulletPoints) {
        if (!bullet.included) continue;
        total += calcWordCount(bullet.text);
      }
    }
  }

  if (resumeContainsSection(resume, "education")) {
    for (const education of resume.educationHistory) {
      if (!education.included) continue;

      total += calcWordCount(education.schoolName);
      total += calcWordCount(education.degree);

      for (const bullet of education.bulletPoints) {
        if (!bullet.included) continue;
        total += calcWordCount(bullet.text);
      }
    }
  }

  if (resumeContainsSection(resume, "projects")) {
    for (const project of resume.projectHistory) {
      if (!project.included) continue;

      total += calcWordCount(project.projectName);

      for (const bullet of project.bulletPoints) {
        if (!bullet.included) continue;
        total += calcWordCount(bullet.text);
      }
    }
  }

  return total;
}

function calcWordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function calcResumeBulletCount(resume: Resume): number {
  let count = 0;

  if (resumeContainsSection(resume, "work")) {
    count += resume.workHistory
      .map(calcExpBulletCount)
      .reduce((a, b) => a + b, 0);
  }

  if (resumeContainsSection(resume, "education")) {
    count += resume.educationHistory
      .map(calcExpBulletCount)
      .reduce((a, b) => a + b, 0);
  }

  if (resumeContainsSection(resume, "projects")) {
    count += resume.projectHistory
      .map(calcExpBulletCount)
      .reduce((a, b) => a + b, 0);
  }

  return count;
}

function calcExpBulletCount(exp: Experience): number {
  if (!exp.included) return 0;
  return exp.bulletPoints.reduce((count, b) => count + (b.included ? 1 : 0), 0);
}

function resumeContainsSection(
  resume: Resume,
  sectionId: ResumeSectionId
): boolean {
  return (
    resume.sectionOrder.find(
      (section) => section.id === sectionId && section.included
    ) !== undefined
  );
}
