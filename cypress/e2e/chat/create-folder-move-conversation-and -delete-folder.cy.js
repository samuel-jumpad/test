import { LoginPage } from "../../support/pages/login/login.page.js";
import { ChatPage } from "../../support/pages/chat/chat.page.js";

describe("Criar Pasta, Mover Conversa e Deletar Pasta", () => {
  const loginPage = new LoginPage();
  const chatPage = new ChatPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("Deve mover mensagem para a pasta corretamente", () => {
    chatPage.gerenciarPastasCompleto();
  });
});