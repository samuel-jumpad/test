import { LoginPage } from "../../support/pages/login/login.page.js";
import { ChatPage } from "../../support/pages/chat/chat.page.js";

describe("Acessar agente antigo testar/chat/agente", () => {
  const loginPage = new LoginPage();
  const chatPage = new ChatPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve acessar agente, testar enviar um chat, e no chat buscar o agente e enviar mensagem", () => {
    chatPage.enviarMensagemParaAgenteAntigo();
  });
});