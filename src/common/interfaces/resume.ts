import { MonthYear } from "../interfaces/time";

export interface Resume {
  personalDetails: PersonalDetails;
  workHistory: WorkExperience[];
  educationHistory: EducationExperience[];
  projectHistory: ProjectExperience[];
  skillGroups: SkillGroup[];
  sectionOrder: ResumeSectionItem[];
}

export const ALL_RESUME_SECTIONS = [
  "personal",
  "skills",
  "work",
  "education",
  "projects",
] as const;
type ResumeTuple = typeof ALL_RESUME_SECTIONS;
export type ResumeSectionId = ResumeTuple[number];

export function isResumeSectionId(str: string): str is ResumeSectionId {
  return ALL_RESUME_SECTIONS.includes(str as ResumeSectionId);
}

export interface ResumeSectionItem extends Includable, Identifiable {
  id: ResumeSectionId;
}

export interface PersonalDetails {
  fullName: string;
  title: string;
  email: string;
  phoneNumber: string;
  websiteUrl: string;
  location: string;
}

export interface WorkExperience extends Experience {
  companyName: string;
  companyWebsiteUrl: string;
  jobTitle: string;
}

export interface EducationExperience extends Experience {
  schoolName: string;
  schoolWebsiteUrl: string;
  degree: string;

  /**
   * Expected end date if ongoing.
   */
  endDate: MonthYear;
}

export interface ProjectExperience extends Experience {
  projectName: string;
  projectWebsiteUrl: string;
}

export interface Experience extends Includable, Identifiable {
  startDate: MonthYear;
  endDate: MonthYear | null;
  bulletPoints: BulletPoint[];
}

export interface SkillGroup extends Includable, Identifiable {
  groupName: string;
  skills: BulletPoint[];
}

export interface BulletPoint extends Includable, Identifiable {
  text: string;
}

export interface Includable {
  included: boolean;
}

export interface Identifiable {
  id: string;
}
