import { LoginPage } from "../../support/pages/login/login.page.js";
import { AgentPage } from "../../support/pages/agent/agent.page.js";

describe("Teste Creat - Criar Agente", () => {
  const loginPage = new LoginPage();
  const agentPage = new AgentPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
    agentPage.configurarInterceptacoes();
  });

  it("deve criar agente com sucesso", () => {
    const nomeAgente = 'Agente Teste Automatizado';
    const descricao = 'Descrição do Agente de Teste Automatizado';
    const instrucoes = 'Relacionado a teste automatizado com cypress.';
    
    // Usar o método principal da página de objeto para criar agente completo
    agentPage.criarAgenteCompleto(nomeAgente, descricao, instrucoes);
  });
});