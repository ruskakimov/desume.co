import { actionVerbs } from "../../../../common/constants/action-verbs";
import { fixFormat } from "./format";
import { ValidationItemProps } from "./ValidationItem";

export function validateActionVerb(text: string | undefined) {
  const found: ValidationItemProps = {
    icon: "success",
    label: "Starts with an action verb",
  };
  const notFound: ValidationItemProps = {
    icon: "failure",
    label: "Doesn't start with an action verb",
  };

  if (!text) return notFound;

  const formatted = fixFormat(text);
  const firstWord = formatted.split(" ").at(0);

  const startsWithActionVerb = actionVerbs.includes(firstWord ?? "");

  return startsWithActionVerb ? found : notFound;
}

export function validateQuantitativeData(
  text: string | undefined
): ValidationItemProps {
  const found: ValidationItemProps = {
    icon: "success",
    label: "Includes quantitative data",
  };
  const notFound: ValidationItemProps = {
    icon: "warning",
    label: "No quantitative data",
  };

  const containsNumbers = text && /[0-9]/.test(text);
  return containsNumbers ? found : notFound;
}
