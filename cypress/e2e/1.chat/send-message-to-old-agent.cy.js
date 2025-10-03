import { LoginPage } from "../../support/pages/login/login.page.js";
import { ChatPage } from "../../support/pages/chat/chat.page.js";

describe("Acessar agente antigo e enviar um chat", () => {
  const loginPage = new LoginPage();
  const chatPage = new ChatPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve acessar chat antigo de um agente e enviar um chat", () => {
    chatPage.enviarMensagemParaAgenteAntigo();
  });
});