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
  educationHistory: Education[];
  projectHistory: Project[];
  skills: string[];
}

export interface WorkExperience extends Experience {
  companyName: string;
  companyWebsiteUrl: string | null;
  jobTitle: string;
}

export interface Education extends Experience {
  schoolName: string;
  schoolWebsiteUrl: string;
  degree: string;
}

export interface Project extends Experience {
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
