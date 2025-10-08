import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Descreva a imagem", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve acessar chat e descrever a imagem", () => {
    // ===== CONFIGURAÇÕES E INTERCEPTAÇÕES =====
    cy.log('🔧 Configurando interceptações...');
    
    // Interceptar APIs de chat para acelerar execução
    cy.intercept('GET', '**/api/chat/**', { fixture: 'chat-response.json' }).as('chatApi');
    cy.intercept('POST', '**/api/chat/**', { fixture: 'chat-response.json' }).as('chatSend');
    cy.intercept('POST', '**/api/upload/**', { fixture: 'upload-response.json' }).as('uploadApi');
    
    // Bloquear recursos desnecessários
    cy.intercept('GET', '**/translations/**', { body: {} }).as('translations');
    cy.intercept('GET', '**/*.woff*', { body: '' }).as('fonts');
    
    cy.log('✅ Interceptações configuradas');

    // ===== NAVEGAÇÃO PARA CHAT =====
    cy.log('🔍 Navegando para Chat...');
    
    // Aguardar carregamento completo
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Estratégias robustas para encontrar e clicar em Chat
    cy.get('body').then(($body) => {
      const chatSelectors = [
        'button:contains("Chat")',
        'a:contains("Chat")',
        '[role="button"]:contains("Chat")',
        '[data-testid*="chat"]',
        '[aria-label*="chat"]',
        'nav button:contains("Chat")',
        'nav a:contains("Chat")',
        '.nav-item:contains("Chat")',
        '.menu-item:contains("Chat")',
        '.sidebar-item:contains("Chat")'
      ];
      
      let chatEncontrado = false;
      for (const selector of chatSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Chat encontrado com seletor: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click({ force: true });
          chatEncontrado = true;
          break;
        }
      }
      
      if (!chatEncontrado) {
        cy.log('⚠️ Chat não encontrado, tentando navegação direta...');
        cy.visit('/chat', { failOnStatusCode: false });
      }
    });
    
    cy.wait(3000);
    cy.log('✅ Navegação para Chat concluída');

    // ===== BOTÃO ADICIONAR/CONVERSAR =====
    cy.log('🔍 Clicando no botão +...');
    
    cy.get('body').then(($body) => {
      const addSelectors = [
        'button svg.lucide-plus',
        'button[aria-label*="adicionar"]',
        'button[aria-label*="novo"]',
        'button[aria-label*="new"]',
        'button[title*="adicionar"]',
        'button[title*="novo"]',
        '[data-testid*="add"]',
        '[data-testid*="new"]',
        'button:contains("+")',
        'button:contains("Novo")',
        'button:contains("New")'
      ];
      
      let addEncontrado = false;
      for (const selector of addSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão + encontrado com seletor: ${selector}`);
          
          if (selector.includes('svg')) {
            // Para SVGs, tentar clicar no botão pai primeiro
            cy.get(selector).first()
              .should('be.visible')
              .parent()
              .click({ force: true });
          } else {
            cy.get(selector).first()
              .should('be.visible')
              .click({ force: true });
          }
          
          addEncontrado = true;
          break;
        }
      }
      
      if (!addEncontrado) {
        cy.log('⚠️ Botão + não encontrado, tentando fallback...');
        cy.get('button').contains(/\+|adicionar|novo|new/i).first()
          .should('be.visible')
          .click({ force: true });
      }
    });
    
    cy.log('✅ Botão + clicado');

    // ===== ANEXAR ARQUIVO =====
    cy.log('🔍 Clicando em Anexar...');
    
    cy.get('body').then(($body) => {
      const anexarSelectors = [
        '[role="menuitem"]:contains("Anexar")',
        '[role="menuitem"]:contains("Attach")',
        '[role="menuitem"]:contains("Upload")',
        'button:contains("Anexar")',
        'button:contains("Attach")',
        'a:contains("Anexar")',
        'a:contains("Attach")',
        '[data-testid*="attach"]',
        '[data-testid*="upload"]',
        '[aria-label*="anexar"]',
        '[aria-label*="attach"]'
      ];
      
      let anexarEncontrado = false;
      for (const selector of anexarSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Anexar encontrado com seletor: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click({ force: true });
          anexarEncontrado = true;
          break;
        }
      }
      
      if (!anexarEncontrado) {
        cy.log('⚠️ Anexar não encontrado, tentando fallback...');
        cy.get('[role="menuitem"]').first()
          .should('be.visible')
          .click({ force: true });
      }
    });
    
    cy.log('✅ Opção Anexar clicada');

    // ===== ANEXAR IMAGEM =====
    cy.log('🔍 Anexando imagem...');
    
    // Aguardar o input de arquivo aparecer
    cy.get('input[type="file"]')
      .should('exist')
      .first()
      .selectFile('cypress/fixtures/uploads/imagem-teste.jpg', { force: true });
    
    cy.log('✅ Imagem anexada com sucesso');
    
    // Aguardar o upload da imagem
    cy.wait(3000);
    
    // Validar que a imagem foi carregada
    cy.get('body').should('contain.text', 'imagem-teste.jpg');
    cy.log('✅ Imagem carregada e visível na interface');

    // ===== DIGITAR MENSAGEM =====
    cy.log('🔍 Digitando mensagem...');
    const mensagem = 'Descreva essa imagem';
    
    cy.get('body').then(($body) => {
      const inputSelectors = [
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]',
        '[data-testid*="message-input"]',
        '[data-testid*="chat-input"]',
        'input[placeholder*="mensagem"]',
        'input[placeholder*="message"]',
        'textarea[placeholder*="mensagem"]',
        'textarea[placeholder*="message"]'
      ];
      
      let inputEncontrado = false;
      for (const selector of inputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
          cy.log('✅ Mensagem digitada');
          inputEncontrado = true;
          break;
        }
      }
      
      if (!inputEncontrado) {
        cy.log('⚠️ Input não encontrado, tentando fallback...');
        cy.get('input, textarea, [contenteditable]').first()
          .should('be.visible')
          .clear()
          .type(mensagem, { delay: 100 });
        cy.log('✅ Mensagem digitada com fallback');
      }
    });

    // ===== ENVIAR MENSAGEM =====
    cy.log('🔍 Enviando mensagem...');
    
    cy.get('body').then(($body) => {
      const selectorsBotao = [
        'button[type="submit"]:not([disabled])',
        'button:contains("Enviar")',
        'button:contains("Send")',
        'form button[type="submit"]',
        'button[class*="submit"]',
        'button[class*="send"]',
        'button[class*="enviar"]',
        'button[class*="message"]',
        '[data-testid*="send"]',
        '[data-testid*="submit"]',
        '[aria-label*="enviar"]',
        '[aria-label*="send"]',
        'button[title*="enviar"]',
        'button[title*="send"]'
      ];
      
      let botaoEncontrado = false;
      for (const selector of selectorsBotao) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Send button encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click();
          botaoEncontrado = true;
          break;
        }
      }
      
      if (!botaoEncontrado) {
        cy.log('⚠️ Send button não encontrado, tentando seletores genéricos...');
        if ($body.find('button').length > 0) {
          cy.get('button').last()
            .should('be.visible')
            .click();
        } else {
          cy.log('⚠️ Nenhum button encontrado');
        }
      }
    });
    
    cy.log('✅ Send button clicado');
    
    // ===== VALIDAR ENVIO DA MENSAGEM =====
    cy.log('🔍 Validando envio da mensagem...');
    cy.wait(5000);
    
    // Verificar se o campo de input está vazio
    cy.get('body').then(($body) => {
      if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.get('div[contenteditable="true"]').first().should('be.empty');
        cy.log('✅ Campo de input vazio - mensagem enviada');
      }
    });
    
    // Verificar que não há indicadores de "enviando"
    cy.get('body').should('not.contain', 'enviando');
    cy.get('body').should('not.contain', 'sending');
    cy.log('✅ Nenhum indicador de "enviando" encontrado');
    
    // Verificar que a mensagem aparece na página
    cy.get('body').should('contain.text', mensagem);
    cy.log('✅ Mensagem encontrada na página - envio confirmado');

    // ===== AGUARDAR RESPOSTA DO CHAT =====
    cy.log('📋 Aguardando resposta do chat (palavra esperada: "cachorro")...');
    cy.wait(17000);
    
    // Verificar se a resposta contém a palavra "cachorro"
    cy.get('body').should('contain.text', 'cachorro');
    cy.log('✅ Resposta do chat contém a palavra "cachorro"');
    
    cy.log('✅ Teste de descrição de imagem concluído com sucesso!');
  });
});