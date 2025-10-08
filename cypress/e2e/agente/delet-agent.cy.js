import { LoginPage } from "../../support/pages/login/login.page.js";
import { AgentPage } from "../../support/pages/agent/agent.page.js";

describe("Teste Delet - Delet agent", () => {
  const loginPage = new LoginPage();
  const agentPage = new AgentPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve deletar agente com sucesso", () => {
    agentPage.configurarInterceptacoes();
    cy.log('🔍 Navegando para seção de Agentes...');
    agentPage.navegarParaSecaoAgentes();

    cy.log('🗑️ Iniciando deleção do agente...');
    agentPage.deletarAgenteCompleto('Agente Teste Automatizado');

    cy.log('✅ Teste de deleção concluído com sucesso!');
  });
});