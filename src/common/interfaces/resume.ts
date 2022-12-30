import { MonthYear } from "../interfaces/time";

export interface Resume {
  personalDetails: {
    fullName: string;
    headline: string;
    websiteUrl: string;
    phoneNumber: string;
    email: string;
    location: string;
  } | null;
  workHistory: WorkExperience[];
  educationHistory: EducationExperience[];
  projectHistory: ProjectExperience[];
  skills: string[];
}

export interface WorkExperience extends Experience {
  companyName: string;
  companyWebsiteUrl: string | null;
  jobTitle: string;
}

export interface EducationExperience extends Experience {
  schoolName: string;
  schoolWebsiteUrl: string | null;
  degree: string;

  /**
   * Expected end date if ongoing.
   */
  endDate: MonthYear;
}

export interface ProjectExperience extends Experience {
  projectName: string;
}

export interface Experience {
  startDate: MonthYear;
  endDate: MonthYear | null;
  bulletPoints: BulletPoint[];
  included: boolean;
}

export interface BulletPoint {
  id: string;
  text: string;
  included: boolean;
}
