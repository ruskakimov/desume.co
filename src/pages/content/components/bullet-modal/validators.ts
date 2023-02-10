import { ValidationItemProps } from "./ValidationItem";

export function validateFormat(text: string | undefined): ValidationItemProps {
  const success: ValidationItemProps = {
    icon: "success",
    label: "Correct format",
  };
  const failure: ValidationItemProps = {
    icon: "failure",
    label: "Incorrect format",
  };

  if (!text) return failure;

  const startsWithCapitalLetter = /^[A-Z]/.test(text);
  const endsWithSingleDot = /[A-Za-z0-9]\.$/.test(text);
  const singleSpaceBetweenWords = !text.split(" ").includes("");

  return startsWithCapitalLetter && endsWithSingleDot && singleSpaceBetweenWords
    ? success
    : failure;
}
