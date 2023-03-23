import { Correction } from "../../pages/review/review-context";
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
  return getResumeStrings(resume)
    .map(calcWordCount)
    .reduce((a, b) => a + b, 0);
}

export function getResumeStrings(resume: Resume): string[] {
  const strings: string[] = [];

  if (resumeContainsSection(resume, "personal")) {
    strings.push(resume.personalDetails.location);
    strings.push(resume.personalDetails.title);
  }

  if (resumeContainsSection(resume, "skills")) {
    for (const skillGroup of resume.skillGroups) {
      if (!skillGroup.included) continue;

      strings.push(skillGroup.groupName);

      for (const skill of skillGroup.skills) {
        if (!skill.included) continue;
        strings.push(skill.text);
      }
    }
  }

  if (resumeContainsSection(resume, "work")) {
    for (const workExp of resume.workHistory) {
      if (!workExp.included) continue;

      strings.push(workExp.companyName);
      strings.push(workExp.jobTitle);

      for (const bullet of workExp.bulletPoints) {
        if (!bullet.included) continue;
        strings.push(bullet.text);
      }
    }
  }

  if (resumeContainsSection(resume, "education")) {
    for (const education of resume.educationHistory) {
      if (!education.included) continue;

      strings.push(education.schoolName);
      strings.push(education.degree);

      for (const bullet of education.bulletPoints) {
        if (!bullet.included) continue;
        strings.push(bullet.text);
      }
    }
  }

  if (resumeContainsSection(resume, "projects")) {
    for (const project of resume.projectHistory) {
      if (!project.included) continue;

      strings.push(project.projectName);

      for (const bullet of project.bulletPoints) {
        if (!bullet.included) continue;
        strings.push(bullet.text);
      }
    }
  }

  return strings;
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

export function applyCorrection(
  resume: Resume,
  correction: Correction
): Resume {
  function updateExperience<T extends Experience>(exp: T): T {
    return {
      ...exp,
      bulletPoints: exp.bulletPoints.map((b) =>
        b.text === correction.original
          ? { ...b, text: correction.corrected }
          : b
      ),
    };
  }

  return {
    ...resume,
    workHistory: resume.workHistory.map(updateExperience),
    educationHistory: resume.educationHistory.map(updateExperience),
    projectHistory: resume.projectHistory.map(updateExperience),
  };
}
