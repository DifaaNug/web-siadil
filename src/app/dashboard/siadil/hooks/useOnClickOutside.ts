import { useEffect, RefObject } from "react";

export function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  buttonRef?: RefObject<HTMLElement | null>,
  insideSelectors?: string[]
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        !ref.current ||
        ref.current.contains(event.target as Node) ||
        (buttonRef?.current &&
          buttonRef.current.contains(event.target as Node)) ||
        (insideSelectors &&
          insideSelectors.some((sel) =>
            (event.target as HTMLElement)?.closest(sel)
          ))
      ) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, buttonRef, insideSelectors]);
}
