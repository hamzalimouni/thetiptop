import { render, screen, waitFor } from "@testing-library/react";
import GainDetails from "../pages/GainDetails";
import "@testing-library/jest-dom";

jest.mock("../makeRequest", () => ({
  publicRequest: {
    get: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
  },
  userRequest: {
    put: jest.fn(() => Promise.resolve({ status: 200 })),
  },
}));

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(() => ({ code: "mockedCode" })),
}));

jest.mock("../redux/hooks/hooks", () => ({
  useAppSelector: jest.fn(() => ({ currentUser: { token: "mockedToken" } })),
}));

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(() => ({ id: "mockedUserId", role: "ROLE_ADMIN" })),
}));

describe("GainDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders GainDetails component with initial state", async () => {
    render(<GainDetails />);

    expect(screen.getByText("Detaile de gain")).toBeInTheDocument();

    expect(require("../makeRequest").publicRequest.get).toHaveBeenCalledWith(
      "tickets/used/mockedCode"
    );

    await waitFor(() => {
    });
  });
});
