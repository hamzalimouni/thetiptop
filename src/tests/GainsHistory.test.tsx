import { render, screen, waitFor } from "@testing-library/react";
import GainsHistory from "../pages/GainsHistory";
import "@testing-library/jest-dom";

jest.mock("../makeRequest", () => ({
  userRequest: {
    get: jest.fn(() => Promise.resolve({ status: 200, data: [] })),
  },
}));

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(() => ({ id: "mockedUserId" })),
}));

jest.mock("../redux/hooks/hooks", () => ({
  useAppSelector: jest.fn(() => ({ currentUser: { token: "mockedToken" } })),
}));

describe("GainsHistory Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders GainsHistory component with initial state", async () => {
    render(<GainsHistory />);

    expect(screen.getByText("Mes participations")).toBeInTheDocument();

    expect(require("../makeRequest").userRequest.get).toHaveBeenCalledWith(
      "tickets/user/mockedUserId",
      {
        headers: {
          token: "Bearer mockedToken",
        },
      }
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Consulter ici vos historique de participations et du lots."
        )
      ).toBeInTheDocument();
    });
  });
});
