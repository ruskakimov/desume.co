import { useState } from "react";

export default function useLocalState<T>(
  storageKey: string,
  defaultValue: T,
  validator?: (parsed: any) => boolean
): [T, (state: T) => void] {
  const [state, setState] = useState<T>(() => {
    const stringified = localStorage.getItem(storageKey);
    const parsed = stringified ? JSON.parse(stringified) : null;

    if (!validator) return parsed ?? defaultValue;
    return validator(parsed) ? parsed : defaultValue;
  });

  return [
    state,
    (state) => {
      setState(state);
      localStorage.setItem(storageKey, JSON.stringify(state));
    },
  ];
}
