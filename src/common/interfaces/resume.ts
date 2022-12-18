import { MonthYear } from "../interfaces/time";

/**
 * A domain model of resume.
 */
export interface Resume {
  personalDetails: {
    fullName: string;
    headline: string;
    websiteUrl: string;
    phoneNumber: string;
    email: string;
    location: string;
  };
  workHistory: WorkExperience[];
  educationHistory: Education[];
  projectHistory: Project[];
  skills: string[];
}

export interface WorkExperience {
  companyName: string;
  companyWebsiteUrl?: string;
  jobTitle: string;
  startDate: MonthYear;
  endDate?: MonthYear;
  bulletPoints: BulletPoint[];
  included: boolean;
}

export interface Education {
  schoolName: string;
  schoolWebsiteUrl: string;
  degree: string;
  startDate: MonthYear;
  endDate: MonthYear;
  included: boolean;
}

export interface Project {
  projectName: string;
  description: string;
  startDate: MonthYear;
  endDate: MonthYear;
  included: boolean;
}

export interface BulletPoint {
  id: string;
  text: string;
  included: boolean;
}
