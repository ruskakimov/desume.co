import { ValidationItemProps } from "./ValidationItem";

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
