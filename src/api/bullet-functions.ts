import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

interface SuggestImprovementsRequestData {
  bulletPoint: string;
}

interface SuggestImprovementsResponseData {
  suggestion: string;
}

export const suggestImprovements = httpsCallable<
  SuggestImprovementsRequestData,
  SuggestImprovementsResponseData
>(functions, "suggestImprovements");
