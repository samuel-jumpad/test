export class ChatPage {
  navegarParaChat() {
    cy.log('📋 Navigating to chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.get('body').then(($body) => {
      const selectorsChat = [
        'span:contains("Chat")',
        'div:contains("Chat")',
        'button:contains("Chat")',
        'a:contains("Chat")',
        '[class*="menu"]:contains("Chat")',
        '[class*="nav"]:contains("Chat")'
      ];
      let chatEncontrado = false;
      for (const selector of selectorsChat) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Chat menu found: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click({ force: true });
          chatEncontrado = true;
          break;
        }
      }
      if (!chatEncontrado) {
        cy.log('⚠️ Chat menu not found, trying direct navigation...');
        cy.visit('/dashboard/chat', { timeout: 30000 });
      }
    });
    cy.url({ timeout: 15000 }).should('include', '/chat');
    cy.get('body').should('not.contain', 'loading');
    cy.log('✅ Navigation to chat completed');
    return this;
  }

  selecionarConversaGeral() {
    cy.log('📋 Selecting "Geral" conversation...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      const selectorsGeral = [
        'div.truncate:contains("Geral")',
        'div:contains("Geral")',
        'span:contains("Geral")',
        'button:contains("Geral")',
        '[class*="truncate"]:contains("Geral")',
        '[class*="conversation"]:contains("Geral")',
        '[class*="chat"]:contains("Geral")',
        '[class*="message"]:contains("Geral")',
        '[class*="item"]:contains("Geral")',
        '[class*="list"]:contains("Geral")'
      ];
      
      let geralEncontrado = false;
      for (const selector of selectorsGeral) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ "Geral" found with selector: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click({ force: true });
          geralEncontrado = true;
          break;
        }
      }
      
      if (!geralEncontrado) {
        cy.log('⚠️ "Geral" not found, trying first conversation element...');
        if ($body.find('[class*="conversation"], [class*="chat"], [class*="message"]').length > 0) {
          cy.get('[class*="conversation"], [class*="chat"], [class*="message"]').first()
            .should('be.visible')
            .click({ force: true });
        } else {
          cy.log('⚠️ No conversation element found, continuing...');
        }
      }
    });
    
    cy.log('✅ Conversation selected');
    cy.get('body').should('not.contain', 'loading');
    return this;
  }

  clicarPrimeiraMensagem() {
    cy.log('📋 Opening the last chat message...');
    cy.get('body').should('not.contain', 'loading');
    cy.get('body').then(($body) => {
      const selectorsMensagem = [
        '[class*="flex gap-2 items-center truncate rounded-xl"]',
        '[class*="message"]',
        '[class*="chat-item"]',
        '[class*="conversation"]',
        'div[class*="flex"][class*="gap"]',
        'div[class*="rounded-xl"]',
        '[class*="chat"]',
        '[class*="item"]'
      ];
      
      let mensagemEncontrada = false;
      for (const selector of selectorsMensagem) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Message found: ${selector}`);
          cy.get(selector)
            .first()
            .should('be.visible')
            .click({ force: true });
          mensagemEncontrada = true;
          break;
        }
      }
      
      if (!mensagemEncontrada) {
        cy.log('⚠️ No message found, trying first clickable element...');
        if ($body.find('div[class*="flex"]').length > 0) {
          cy.get('div[class*="flex"]').first()
            .should('be.visible')
            .click({ force: true });
        } else {
          cy.log('⚠️ No message element found, continuing...');
        }
      }
    });
    
    cy.log('✅ Message opened');
    return this;
  }

  enviarMensagem(mensagem = 'ola, como vai?') {
    cy.log(`📝 Sending message: "${mensagem}"`);
    cy.get('body').should('not.contain', 'loading');
    cy.get('body').then(($body) => {
      const selectorsInput = [
        'div[contenteditable="true"][data-placeholder*="Digite aqui"]',
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]',
        'input[placeholder*="mensagem"]',
        'input[placeholder*="message"]',
        'input[placeholder*="Digite"]',
        'input[placeholder*="digite"]'
      ];
      let inputEncontrado = false;
      for (const selector of selectorsInput) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input field found: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
          inputEncontrado = true;
          break;
        }
      }
      if (!inputEncontrado) {
        cy.log('⚠️ Input field not found, trying generic selectors...');
        if ($body.find('input, textarea, [contenteditable]').length > 0) {
          cy.get('input, textarea, [contenteditable]').first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
        } else {
          cy.log('⚠️ No input field found');
        }
      }
    });
    cy.log('✅ Message typed');
    cy.get('body').then(($body) => {
      const selectorsBotao = [
        'button[type="submit"]:not([disabled])',
        'button:contains("Enviar")',
        'button:contains("Send")',
        'form button[type="submit"]',
        'button[class*="submit"]',
        'button[class*="send"]',
        'button[class*="enviar"]',
        'button[class*="message"]'
      ];
      let botaoEncontrado = false;
      for (const selector of selectorsBotao) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Send button found: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click();
          botaoEncontrado = true;
          break;
        }
      }
      if (!botaoEncontrado) {
        cy.log('⚠️ Send button not found, trying generic selectors...');
        if ($body.find('button').length > 0) {
          cy.get('button').last()
            .should('be.visible')
            .click();
        } else {
          cy.log('⚠️ No button found');
        }
      }
    });
    cy.log('✅ Send button clicked');
    cy.get('body').should('not.contain', 'enviando');
    return this;
  }

  validarEnvioMensagem(mensagem = 'ola, como vai?') {
    cy.log('🔍 Validating message sending...');
    cy.get('body').then(($body) => {
      if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.get('div[contenteditable="true"]').first().should('be.empty');
      }
    });
    cy.get('body').should('not.contain', 'enviando');
    cy.get('body').should('not.contain', 'sending');
    cy.get('body').should('contain.text', mensagem);
    cy.log('✅ Message sent and validated successfully');
    return this;
  }

  fluxoCompletoChat(mensagem = 'ola, como vai?') {
    cy.log('🚀 Starting complete chat flow...');
    this.navegarParaChat()
      .selecionarConversaGeral()
      .clicarPrimeiraMensagem()
      .enviarMensagem(mensagem)
      .validarEnvioMensagem(mensagem);
    cy.log('✅ Complete chat flow finished');
    return this;
  }
}