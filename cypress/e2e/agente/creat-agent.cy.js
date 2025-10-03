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
    const nomeAgente = 'Agente Teste Automatizado';
    const descricao = 'Descrição do Agente de Teste Automatizado';
    const instrucoes = 'Relacionado a teste automatizado com cypress.';
    
    // Navegar e abrir formulário usando Page Object
    agentPage.navegarParaSecaoAgentes()
      .clicarEmMeusAgentes()
      .clicarEmCriarNovoAgente()
      .verificarFormularioCarregado();

    // Continuar com o resto do fluxo usando Page Object
    agentPage.encontrarCampoNome()
      .preencherCampoNome(nomeAgente)
      .preencherCampoDescricao(descricao)
      .preencherCampoInstrucoes(instrucoes)
      .rolarAteFinal()
      .validarCamposPreenchidos(nomeAgente)
      .tratarCamposObrigatorios(nomeAgente)
      .clicarEmSalvar()
      .verificarToastSucesso();
  });
});