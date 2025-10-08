import { LoginPage } from "../../support/pages/login/login.page.js";
import { ChatPage } from "../../support/pages/chat/chat.page.js";

describe("Descreva a imagem", () => {
  const loginPage = new LoginPage();
  const chatPage = new ChatPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve acessar chat e descrever a imagem", () => {
   
    chatPage.descreverImagemCompleto(
      'cypress/fixtures/uploads/imagem-teste.jpg',
      'Descreva essa imagem',
      'cachorro'
    );
  });
});