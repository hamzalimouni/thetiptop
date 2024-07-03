import { render, screen } from "@testing-library/react";
import Faq from "../pages/Faq";
import { BrowserRouter } from "react-router-dom"; 
import "@testing-library/jest-dom";

describe("Faq Component", () => {
  test("renders frequently asked questions", () => {
    render(
      <BrowserRouter basename="/">
        <Faq />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Questions fréquemment posées")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Proposez-vous des thés sans caféine ?")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Bien sûr ! Vous pouvez visiter notre 10ème boutique qui vient d'ouvrir à Nice. Nos experts en thé seront ravis de vous accueillir et de vous guider à travers notre sélection."
      )
    ).toBeInTheDocument();

  });
});
