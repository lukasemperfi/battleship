import { render } from "@testing-library/react";
import { type ReactElement } from "react";
import {
  type JestAxeConfigureOptions,
  axe,
  toHaveNoViolations,
} from "jest-axe";

expect.extend(toHaveNoViolations);

export const testA11y = async (
  ui: ReactElement,
  axeOptions?: JestAxeConfigureOptions
): Promise<void> => {
  const { container } = render(ui);
  const results = await axe(container, axeOptions);

  expect(results).toHaveNoViolations();
};
