import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Teste Delet - Delet Agente", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
	  cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve deletar agente com sucesso", () => {
    // Clicar em agente

    cy.xpath('//button[span[text()="Agentes"]]')
    .should('be.visible')
    .click();

  // Meus agentes
  cy.xpath('//div[normalize-space(text())="Meus Agentes"]')
    .should('be.visible')
    .click();

// Digita o nome no campo de busca
cy.xpath('//input[@type="search" and @placeholder="Buscar por nome"]')
.should('be.visible')
.clear()
.type('Agente Teste Automatizado', { delay: 100 });

 // Aguarda a tabela carregar 
 cy.wait(3000);

  // Primeiro verifica se o agente foi criado e está visível na tabela
  cy.xpath('//td[normalize-space(text())="Agente Teste"]')
  .should('be.visible')
  .scrollIntoView();

// Debug: verifica se a linha da tabela existe
cy.xpath('//td[normalize-space(text())="Agente Teste"]/ancestor::tr')
  .should('exist')
  .should('be.visible');

// Debug: verifica se existe algum botão na linha
cy.xpath('//td[normalize-space(text())="Agente Teste"]/ancestor::tr//button')
  .should('exist')
  .should('have.length.greaterThan', 0);

// Estratégia mais simples e robusta: usar seletor CSS
// Encontra a linha que contém "Agente Teste" e clica no último botão (lixeira)
cy.get('table tbody tr')
  .contains('Agente Teste')
  .parent('tr')
  .find('button')
  .last()
  .should('be.visible')
  .click();

// Confirma a exclusão no modal
cy.xpath('//button[contains(@class,"bg-[#e81b37]")]//div[contains(text(),"Deletar agente")]')
.should('be.visible')
.click();



// Aguarda o toast aparecer e valida o conteúdo
cy.wait(2000); // Aguarda o toast carregar

// Valida que a mensagem de sucesso apareceu (abordagem mais simples)
cy.contains('Agente removido').should('be.visible');
















  });
});
