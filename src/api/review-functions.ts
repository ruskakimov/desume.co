import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase-setup";

export interface FixGrammarRequestData {
  strings: string[];
}

export interface FixGrammarResponseData {
  corrections: {
    wrong: string;
    fixed: string;
  }[];
}

export const fixGrammar = httpsCallable<
  FixGrammarRequestData,
  FixGrammarResponseData
>(functions, "fixGrammar");
