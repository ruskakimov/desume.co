import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase-setup";

interface FixGrammarRequestData {
  strings: string[];
}

interface FixGrammarResponseData {
  corrections: {
    wrong: string;
    fixed: string;
  }[];
}

export const fixGrammar = httpsCallable<
  FixGrammarRequestData,
  FixGrammarResponseData
>(functions, "fixGrammar");
