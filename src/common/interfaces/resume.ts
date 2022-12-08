import { MonthYear } from "./month-year";

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
  companyWebsiteUrl: string;
  jobTitle: string;
  startDate: MonthYear;
  endDate: MonthYear | null;
  bulletPoints: string[];
}

export interface Education {
  schoolName: string;
  schoolWebsiteUrl: string;
  degree: string;
  startDate: MonthYear;
  endDate: MonthYear;
}

export interface Project {
  projectName: string;
  description: string;
  startDate: MonthYear;
  endDate: MonthYear;
}
