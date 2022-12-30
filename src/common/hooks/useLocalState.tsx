import { useState } from "react";

export default function useLocalState<T>(
  storageKey: string,
  defaultValue: T
): [T, (state: T) => void] {
  const [state, setState] = useState<T>(() => {
    const restoredState = localStorage.getItem(storageKey);
    return restoredState ? JSON.parse(restoredState) : defaultValue;
  });

  return [
    state,
    (state) => {
      setState(state);
      localStorage.setItem(storageKey, JSON.stringify(state));
    },
  ];
}
