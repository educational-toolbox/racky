import { render } from "@testing-library/react";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { beforeEach, describe, expect, test, vi, afterEach } from "vitest";
import { UserPage } from "./user.page";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

describe("User page tests", () => {
  beforeEach(() => {
    vi.mock("~/lib/api/client", () => ({
      api: {
        user: {
          getUser: {
            useQuery: () => ({
              isLoading: false,
              data: null,
            }),
          },
        },
      },
    }));
  });

  test("User page", () => {
    const rendered = render(<UserPage id="1" />);
    const found = rendered.findByText("User not found");
    expect(found).toBeDefined();
  });
});
