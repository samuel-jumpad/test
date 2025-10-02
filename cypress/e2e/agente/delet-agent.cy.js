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
    // Configurar interceptações para otimizar o teste
    agentPage.configurarInterceptacoes();

    // Navegar para a seção de Agentes
    cy.log('🔍 Navegando para seção de Agentes...');
    agentPage.navegarParaSecaoAgentes();

    // Deletar agente usando método completo da página
    cy.log('🗑️ Iniciando deleção do agente...');
    agentPage.deletarAgenteCompleto('Agente Teste Automatizado');

    cy.log('✅ Teste de deleção concluído com sucesso!');
  });
});