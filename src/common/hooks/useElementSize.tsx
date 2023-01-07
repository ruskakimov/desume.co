import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Size } from "../interfaces/measure";

function useElementSize<T extends HTMLElement = HTMLDivElement>(
  watchValues: any[] = []
): [(node: T | null) => void, Size] {
  const [ref, setRef] = useState<T | null>(null);
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const handleSize = useCallback(() => {
    // TODO: getBoundingClientRect is more precise
    setSize({
      width: ref?.offsetWidth || 0,
      height: ref?.offsetHeight || 0,
    });
  }, [ref?.offsetHeight, ref?.offsetWidth, ...watchValues]);

  // Get the initial size.
  useLayoutEffect(() => {
    handleSize();
  }, [ref?.offsetHeight, ref?.offsetWidth, ...watchValues]);

  // Listen to the potential size changes on window resize.
  useEffect(() => {
    window.addEventListener("resize", handleSize);

    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, [ref?.offsetHeight, ref?.offsetWidth, ...watchValues]);

  return [setRef, size];
}

export default useElementSize;
