import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import { firebaseApp } from "./firebase-setup";

const functions = getFunctions(firebaseApp);

// TODO: Remove before deploying or use a condition
connectFunctionsEmulator(functions, "localhost", 5001);

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
