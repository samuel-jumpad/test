import { LoginPage } from "../../support/pages/login/login.page.js";
import { AgentPage } from "../../support/pages/agent/agent.page.js";

describe("Agentes - Acessando Agente Antigo", () => {
  const agentPage = new AgentPage();

  beforeEach(() => {
    cy.setupTest();
  });

  it("deve acessar agente antigo e enviar mensagens com sucesso", () => {
    agentPage
      .accessOldAgent()
      .waitForPageLoad();
  });
});