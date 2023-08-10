import { useEffect, useState, type RefObject } from "react";

type DomElementType = RefObject<HTMLElement> | HTMLElement | null;

export const useDomRect = (element: DomElementType): DOMRect | null => {
  const [position, setPosition] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handlePosition = (): void => {
      if (element) {
        const targetElement =
          element instanceof HTMLElement ? element : element.current;

        if (targetElement) {
          const domRect = targetElement.getBoundingClientRect();
          setPosition(domRect);
        }
      }
    };

    handlePosition();

    window.addEventListener("resize", handlePosition);
    window.addEventListener("scroll", handlePosition);

    return () => {
      window.removeEventListener("resize", handlePosition);
      window.addEventListener("scroll", handlePosition);
    };
  }, [element]);

  return position;
};
