import LoginPage from "../../support/pages/login/login.page.js";
import AgentPage from "../../support/pages/agent/agent.page.js";

describe("Agents - Accessing Old Agent", () => {
  beforeEach(() => {
    cy.setupTest();
  });

  it("should access old agent and send messages successfully", () => {
    AgentPage
      .accessOldAgent()
      .waitForPageLoad();
  });
});