import { LoginPage } from "../../support/pages/login/login.page.js";
import { AgentPage } from "../../support/pages/agent/agent.page.js";

describe("Teste Creat - Criar Agente", () => {
  const loginPage = new LoginPage();
  const agentPage = new AgentPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve criar agente com sucesso", () => {
    // Criar agente usando o Page Object
    agentPage.criarAgenteCompleto(
      'Agente Teste Automatizado',
      'Descrição do Agente de Teste Automatizado',
      'Relacionado a teste automatizado com cypress.'
    );
          });
        });
        