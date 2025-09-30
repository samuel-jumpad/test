import LoginPage from "../../support/pages/login/login.page.js";
import AgentPage from "../../support/pages/agent/agent.page.js";

describe("Agentes - Acessando Agente Antigo", () => {
  it("deve acessar agente antigo e enviar um chat", () => {
    // Acessa a página inicial
    cy.visit("/", { timeout: 30000 });

    // Faz login
    cy.get('input[name="email"]').should("be.visible").type("teste@email.com");
    cy.get('input[name="password"]').should("be.visible").type("Jumpad@2025");
    cy.get('button[type="submit"]').should("be.visible").click();

    // Confirma que foi para o dashboard
    cy.url({ timeout: 30000 }).should("include", "/dashboard");

    // Confirma que existe mensagem de boas-vindas
    cy.xpath('//h4[contains(text(), "Boas vindas")]').should("be.visible");
    cy.xpath('//span[normalize-space(text())="Agentes"]').click();
    cy.contains("Explore e desenvolva versões únicas de agentes").should('be.visible');

    cy.xpath('//button//div[contains(text(), "Meus Agentes")]')
      .should('be.visible')
      .click();
      cy.wait(3000);

      cy.xpath('//button[.//svg[contains(@class,"lucide-sparkles")] and .//text()[normalize-space()="Testar"]]')
  .should('be.visible')
  .click();








  });
});