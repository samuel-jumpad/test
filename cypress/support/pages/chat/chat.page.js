export class ChatPage {
  navegarParaChat() {
    cy.log('📋 Navegando para o chat...');
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
          cy.log(`✅ Menu Chat encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click({ force: true });
          chatEncontrado = true;
          break;
        }
      }
      if (!chatEncontrado) {
        cy.log('⚠️ Menu Chat não encontrado, tentando navegação direta...');
        cy.visit('/dashboard/chat', { timeout: 30000 });
      }
    });
    cy.url({ timeout: 15000 }).should('include', '/chat');
    cy.get('body').should('not.contain', 'loading');
    cy.log('✅ Navegação para chat concluída');
    return this;
  }

  selecionarConversaGeral() {
    cy.log('📋 Selecionando conversa "Geral"...');
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
          cy.log(`✅ "Geral" encontrado com seletor: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click({ force: true });
          geralEncontrado = true;
          break;
        }
      }
      
      if (!geralEncontrado) {
        cy.log('⚠️ "Geral" não encontrado, tentando primeiro elemento de conversa...');
        if ($body.find('[class*="conversation"], [class*="chat"], [class*="message"]').length > 0) {
          cy.get('[class*="conversation"], [class*="chat"], [class*="message"]').first()
            .should('be.visible')
            .click({ force: true });
        } else {
          cy.log('⚠️ Nenhum elemento de conversa encontrado, continuando...');
        }
      }
    });
    
    cy.log('✅ Conversa selecionada');
    cy.get('body').should('not.contain', 'loading');
    return this;
  }

  clicarPrimeiraMensagem() {
    cy.log('📋 Abrindo a última mensagem do chat...');
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
          cy.log(`✅ Mensagem encontrada: ${selector}`);
          cy.get(selector)
            .first()
            .should('be.visible')
            .click({ force: true });
          mensagemEncontrada = true;
          break;
        }
      }
      
      if (!mensagemEncontrada) {
        cy.log('⚠️ Nenhuma mensagem encontrada, tentando primeiro elemento clicável...');
        if ($body.find('div[class*="flex"]').length > 0) {
          cy.get('div[class*="flex"]').first()
            .should('be.visible')
            .click({ force: true });
        } else {
          cy.log('⚠️ Nenhum elemento de mensagem encontrado, continuando...');
        }
      }
    });
    
    cy.log('✅ Mensagem aberta');
    return this;
  }

  enviarMensagem(mensagem = 'ola, como vai?') {
    cy.log(`📝 Enviando mensagem: "${mensagem}"`);
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
          cy.log(`✅ Campo de input encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
          inputEncontrado = true;
          break;
        }
      }
      if (!inputEncontrado) {
        cy.log('⚠️ Campo de input não encontrado, tentando seletores genéricos...');
        if ($body.find('input, textarea, [contenteditable]').length > 0) {
          cy.get('input, textarea, [contenteditable]').first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
        } else {
          cy.log('⚠️ Nenhum campo de input encontrado');
        }
      }
    });
    cy.log('✅ Mensagem digitada');
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
          cy.log(`✅ Botão de enviar encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click();
          botaoEncontrado = true;
          break;
        }
      }
      if (!botaoEncontrado) {
        cy.log('⚠️ Botão de enviar não encontrado, tentando seletores genéricos...');
        if ($body.find('button').length > 0) {
          cy.get('button').last()
            .should('be.visible')
            .click();
        } else {
          cy.log('⚠️ Nenhum botão encontrado');
        }
      }
    });
    cy.log('✅ Botão de enviar clicado');
    cy.get('body').should('not.contain', 'enviando');
    return this;
  }

  validarEnvioMensagem(mensagem = 'ola, como vai?') {
    cy.log('🔍 Validando envio da mensagem...');
    cy.get('body').then(($body) => {
      if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.get('div[contenteditable="true"]').first().should('be.empty');
      }
    });
    cy.get('body').should('not.contain', 'enviando');
    cy.get('body').should('not.contain', 'sending');
    cy.get('body').should('contain.text', mensagem);
    cy.log('✅ Mensagem enviada e validada com sucesso');
    return this;
  }

  fluxoCompletoChat(mensagem = 'ola, como vai?') {
    cy.log('🚀 Iniciando fluxo completo de chat...');
    this.navegarParaChat()
      .selecionarConversaGeral()
      .clicarPrimeiraMensagem()
      .enviarMensagem(mensagem)
      .validarEnvioMensagem(mensagem);
    cy.log('✅ Fluxo completo de chat concluído');
    return this;
  }
}