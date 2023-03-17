import {
  extractBoolean,
  extractNumber,
  extractProperty,
  extractString,
} from "../common/functions/defensive";
import { sortExperiences } from "../common/functions/experiences";
import {
  ALL_RESUME_SECTIONS,
  BulletPoint,
  EducationExperience,
  isResumeSectionId,
  PersonalDetails,
  ProjectExperience,
  Resume,
  ResumeSectionItem,
  SkillGroup,
  WorkExperience,
} from "../common/interfaces/resume";
import { isObject, notNullish } from "../common/functions/type-guards";
import { generateId } from "../common/functions/ids";
import { MonthYear } from "../common/interfaces/time";
import { User } from "firebase/auth";

export function parseResume(data: unknown, user: User): Resume {
  const workHistory = extractProperty(data, "personalDetails");
  const educationHistory = extractProperty(data, "educationHistory");
  const projectHistory = extractProperty(data, "projectHistory");
  const skillGroups = extractProperty(data, "skillGroups");
  const sectionOrder = extractProperty(data, "sectionOrder");

  const resume: Resume = {
    personalDetails: parseResumePersonalDetails(data, user),
    workHistory: sortExperiences(parseWorkHistory(workHistory)),
    educationHistory: sortExperiences(parseEducationHistory(educationHistory)),
    projectHistory: sortExperiences(parseProjectHistory(projectHistory)),
    skillGroups: parseSkillGroups(skillGroups),
    sectionOrder: parseSectionOrder(sectionOrder),
  };

  return resume;
}

function parseResumePersonalDetails(
  data: unknown,
  user: User
): PersonalDetails {
  const details = extractProperty(data, "personalDetails");
  return {
    fullName: extractString(details, "fullName") ?? user.displayName ?? "",
    title: extractString(details, "title") ?? "",
    email: extractString(details, "email") ?? user.email ?? "",
    phoneNumber: extractString(details, "phoneNumber") ?? "",
    websiteUrl: extractString(details, "websiteUrl") ?? "",
    location: extractString(details, "location") ?? "",
  };
}

function parseWorkHistory(data: unknown): WorkExperience[] {
  if (!Array.isArray(data)) return [];

  const array = data as unknown[];
  const usedIds = new Set<string>();

  return array
    .map((x) => {
      const id = extractString(x, "id");
      const included = extractBoolean(x, "included");
      const companyName = extractString(x, "companyName");
      const companyWebsiteUrl = extractString(x, "companyWebsiteUrl");
      const jobTitle = extractString(x, "jobTitle");
      const startDate = extractProperty(x, "startDate");
      const endDate = extractProperty(x, "endDate");
      const bulletPoints = extractProperty(x, "bulletPoints");

      const workExperience: WorkExperience = {
        id: id && !usedIds.has(id) ? id : generateId(),
        included: included ?? true,
        companyName: companyName ?? "",
        companyWebsiteUrl: companyWebsiteUrl ?? "",
        jobTitle: jobTitle ?? "",
        startDate: parseMonthYear(startDate) ?? { month: 1, year: 2000 },
        endDate: parseMonthYear(endDate),
        bulletPoints: parseBullets(bulletPoints),
      };

      usedIds.add(workExperience.id);

      return workExperience;
    })
    .filter(notNullish);
}

function parseEducationHistory(data: unknown): EducationExperience[] {
  if (!Array.isArray(data)) return [];

  const array = data as unknown[];
  const usedIds = new Set<string>();

  return array
    .map((x) => {
      const id = extractString(x, "id");
      const included = extractBoolean(x, "included");
      const schoolName = extractString(x, "schoolName");
      const schoolWebsiteUrl = extractString(x, "schoolWebsiteUrl");
      const degree = extractString(x, "degree");
      const startDate = extractProperty(x, "startDate");
      const endDate = extractProperty(x, "endDate");
      const bulletPoints = extractProperty(x, "bulletPoints");

      const educationExperience: EducationExperience = {
        id: id && !usedIds.has(id) ? id : generateId(),
        included: included ?? true,
        schoolName: schoolName ?? "",
        schoolWebsiteUrl: schoolWebsiteUrl ?? "",
        degree: degree ?? "",
        startDate: parseMonthYear(startDate) ?? { month: 1, year: 2000 },
        endDate: parseMonthYear(endDate) ?? { month: 1, year: 2000 },
        bulletPoints: parseBullets(bulletPoints),
      };

      usedIds.add(educationExperience.id);

      return educationExperience;
    })
    .filter(notNullish);
}

function parseProjectHistory(data: unknown): ProjectExperience[] {
  if (!Array.isArray(data)) return [];

  const array = data as unknown[];
  const usedIds = new Set<string>();

  return array
    .map((x) => {
      const id = extractString(x, "id");
      const included = extractBoolean(x, "included");
      const projectName = extractString(x, "projectName");
      const projectWebsiteUrl = extractString(x, "projectWebsiteUrl");
      const startDate = extractProperty(x, "startDate");
      const endDate = extractProperty(x, "endDate");
      const bulletPoints = extractProperty(x, "bulletPoints");

      const projectExperience: ProjectExperience = {
        id: id && !usedIds.has(id) ? id : generateId(),
        included: included ?? true,
        projectName: projectName ?? "",
        projectWebsiteUrl: projectWebsiteUrl ?? "",
        startDate: parseMonthYear(startDate) ?? { month: 1, year: 2000 },
        endDate: parseMonthYear(endDate) ?? { month: 1, year: 2000 },
        bulletPoints: parseBullets(bulletPoints),
      };

      usedIds.add(projectExperience.id);

      return projectExperience;
    })
    .filter(notNullish);
}

function parseSkillGroups(data: unknown): SkillGroup[] {
  if (!Array.isArray(data)) return [];

  const array = data as unknown[];
  const usedIds = new Set<string>();

  return array
    .map((x) => {
      const id = extractString(x, "id");
      const included = extractBoolean(x, "included");
      const groupName = extractString(x, "groupName");
      const skills = extractProperty(x, "skills");

      const skillGroup: SkillGroup = {
        id: id && !usedIds.has(id) ? id : generateId(),
        included: included ?? true,
        groupName: groupName ?? "",
        skills: parseBullets(skills),
      };

      usedIds.add(skillGroup.id);

      return skillGroup;
    })
    .filter(notNullish);
}

function parseSectionOrder(data: unknown): ResumeSectionItem[] {
  if (!Array.isArray(data)) return [];

  const array = data as unknown[];

  const parsedItems = array
    .map((x) => {
      const id = extractString(x, "id");
      const included = extractBoolean(x, "included");

      if (!id || !isResumeSectionId(id)) return null;
      if (id === "personal") return null; // Personal section is pinned.

      const item: ResumeSectionItem = {
        id,
        included: included ?? false,
      };

      return item;
    })
    .filter(notNullish);

  // Add missing sections:
  for (const sectionId of ALL_RESUME_SECTIONS) {
    if (sectionId === "personal") continue; // Personal section is pinned.

    if (!parsedItems.find((x) => x.id === sectionId)) {
      parsedItems.push({
        id: sectionId,
        included: false,
      });
    }
  }

  return parsedItems;
}

function parseMonthYear(data: unknown): MonthYear | null {
  if (!isObject(data)) return null;
  return {
    month: extractNumber(data, "month") ?? 1,
    year: extractNumber(data, "year") ?? 2000,
  };
}

function parseBullets(data: unknown): BulletPoint[] {
  if (!Array.isArray(data)) return [];

  const array = data as unknown[];
  const usedIds = new Set<string>();

  return array
    .map((x) => {
      const id = extractString(x, "id");
      const included = extractBoolean(x, "included");
      const text = extractString(x, "text");

      if (!text) return null;

      const bullet: BulletPoint = {
        id: id && !usedIds.has(id) ? id : generateId(),
        included: included ?? true,
        text,
      };

      usedIds.add(bullet.id);

      return bullet;
    })
    .filter(notNullish);
}
