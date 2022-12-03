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
  startDate: string;
  endDate: string;
}

export interface Education {
  schoolName: string;
  schoolWebsiteUrl: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  projectName: string;
  startDate: string;
  endDate: string;
  description: string;
}
