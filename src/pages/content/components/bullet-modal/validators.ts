import { actionVerbs } from "../../../../common/constants/action-verbs";
import { fixFormat } from "./format";
import { ValidationItemProps } from "./ValidationItem";

export function validateActionVerb(
  text: string | undefined
): ValidationItemProps {
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
  const firstWord = formatted.split(" ")[0];
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

export function validateLength(text: string | undefined): ValidationItemProps {
  const justRight: ValidationItemProps = {
    icon: "success",
    label: "Optimal length",
  };
  const bitShort: ValidationItemProps = {
    icon: "warning",
    label: "A bit short",
  };
  const bitLong: ValidationItemProps = {
    icon: "warning",
    label: "A bit long",
  };
  const tooShort: ValidationItemProps = {
    icon: "failure",
    label: "Too short",
  };
  const tooLong: ValidationItemProps = {
    icon: "failure",
    label: "Too long",
  };

  const formatted = fixFormat(text ?? "");

  if (formatted.length < 40) return tooShort;
  if (formatted.length < 70) return bitShort;
  if (formatted.length < 150) return justRight;
  if (formatted.length < 200) return bitLong;
  return tooLong;
}
