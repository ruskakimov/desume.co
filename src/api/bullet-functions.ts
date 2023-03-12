import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase-setup";

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

interface GenerateVariationsRequestData {
  bulletPoint: string;
  variationCount: number;
}

interface GenerateVariationsResponseData {
  variations: string[];
}

export const generateVariations = httpsCallable<
  GenerateVariationsRequestData,
  GenerateVariationsResponseData
>(functions, "generateVariations");

interface ScoreVariationsRequestData {
  variations: string[];
}

interface ScoreVariationsResponseData {
  scores: number[];
}

export const scoreVariations = httpsCallable<
  ScoreVariationsRequestData,
  ScoreVariationsResponseData
>(functions, "scoreVariations");
