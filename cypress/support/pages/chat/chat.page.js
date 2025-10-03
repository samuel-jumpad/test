

import { LoginPage } from "../../support/pages/login/login.page.js";


describe("Teste chat antigo", () => {
  const loginPage = new LoginPage();


  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve acessar chat antigo e enviar um chat", () => {

   // ===== FASE 3: ACESSAR MENU DE CHAT =====
    cy.xpath('//div[@class="flex-1 overflow-hidden transition-opacity duration-300 ease-in-out text-ellipsis opacity-100"]//span[contains(text(), "Chat")]')
      .should('be.visible')
      .click();

    cy.xpath('//div[@class="truncate" and normalize-space(text())="Geral"]')
      .should('be.visible')
      .click();

    // ===== FASE 4: CLICAR NA PRIMEIRA MENSAGEM DO CHAT =====
    cy.xpath('(//div[contains(@class,"flex gap-2 items-center truncate rounded-xl")])[1]')
      .scrollIntoView()
      .click({ force: true });

    // ===== FASE 5: DIGITAR MENSAGEM NO CAMPO =====
    cy.xpath('//div[@contenteditable="true" and @data-placeholder="Digite aqui sua mensagem..."]')
      .should('be.visible')
      .type('ola, como vai?', { delay: 100 });

    // ===== FASE 6: CLICAR NO BOTÃO DE ENVIAR =====
    cy.xpath('//form[.//div[@contenteditable="true" and @data-placeholder="Digite aqui sua mensagem..."]]//button[@type="submit" and not(@disabled)]', { timeout: 15000 })
      .should('be.visible')
      .scrollIntoView()
      .click();

    // ===== FASE 7: VERIFICAR SE A MENSAGEM FOI EXIBIDA NO CHAT =====
    cy.log('📋 Fase 7: Validando mensagem enviada...');
    
    // Aguardar requisições de rede relacionadas ao envio da mensagem
    cy.intercept('POST', '**/messages/**').as('messageSent');
    cy.intercept('GET', '**/messages/**').as('messageReceived');
    
    // Aguardar o carregamento da mensagem com estratégia mais robusta
    cy.wait(2000);
    
    // Aguardar até que não haja mais loading na página
    cy.get('body').should('not.contain', 'loading', { timeout: 10000 });
    
    // Aguardar um pouco mais para garantir que a mensagem foi renderizada
    cy.wait(2000);


    // Estratégia principal: aguardar a mensagem aparecer usando should()
    cy.log('🔍 Aguardando mensagem aparecer no chat...');
    
    // Aguardar até 30 segundos para a mensagem aparecer no body
    cy.get('body', { timeout: 30000 }).should('contain.text', 'ola, como vai?');
    cy.log('✅ Mensagem encontrada no corpo da página');
    
    // Aguardar um pouco mais para garantir que a mensagem foi completamente renderizada
    cy.wait(1000);
    
    // Agora tentar encontrar o elemento específico da mensagem
    cy.get('body').then(($body) => {
      const selectorsMensagem = [
        'div.p-2.border.rounded-xl.bg-gray-100:contains("ola, como vai?")', // Mensagem do usuário
        'div[class*="message"]:contains("ola, como vai?")', // Qualquer elemento com classe message
        'div[class*="chat"]:contains("ola, como vai?")', // Qualquer elemento com classe chat
        'div[class*="bubble"]:contains("ola, como vai?")', // Bubble de mensagem
        'div[class*="user-message"]:contains("ola, como vai?")', // Mensagem específica do usuário
        'div[class*="sent"]:contains("ola, como vai?")', // Mensagem enviada
        'div[class*="own"]:contains("ola, como vai?")', // Mensagem própria
        'div:contains("ola, como vai?")', // Fallback genérico
        'span:contains("ola, como vai?")', // Texto em span
        'p:contains("ola, como vai?")', // Texto em parágrafo
        '[data-testid*="message"]:contains("ola, como vai?")', // Por data-testid
        '[data-cy*="message"]:contains("ola, como vai?")' // Por data-cy
      ];

      let mensagemEncontrada = false;
      for (const selector of selectorsMensagem) {
        try {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Mensagem encontrada com seletor: ${selector}`);
            cy.get(selector)
              .should('be.visible')
              .scrollIntoView();
            mensagemEncontrada = true;
            break;
          }
        } catch (error) {
          cy.log(`⚠️ Erro com seletor ${selector}: ${error.message}`);
        }
      }

      if (!mensagemEncontrada) {
        cy.log('⚠️ Mensagem encontrada no body mas não com seletores específicos');
        // Fazer debug para entender a estrutura
        cy.get('body').then(($body) => {
          const allTextElements = $body.find('div, span, p, h1, h2, h3, h4, h5, h6, li, td, th');
          cy.log(`🔍 Total de elementos de texto encontrados: ${allTextElements.length}`);
          
          allTextElements.each((index, element) => {
            const text = Cypress.$(element).text().toLowerCase();
            if (text.includes('ola') && text.includes('como') && text.includes('vai')) {
              cy.log(`🎯 Mensagem encontrada no elemento ${index}: "${text}" - Classe: ${element.className} - Tag: ${element.tagName}`);
            }
          });
        });
      }
    });

    cy.log('✅ Mensagem enviada e exibida com sucesso no chat!');
  });

});
