import { MonthYear } from "../interfaces/time";

export interface Resume {
  personalDetails: PersonalDetails;
  workHistory: WorkExperience[];
  educationHistory: EducationExperience[];
  projectHistory: ProjectExperience[];
  skills: string[];
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
