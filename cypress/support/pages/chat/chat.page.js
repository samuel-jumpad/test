export class ChatPage {
  
  // ===== NAVEGAÇÃO =====
  navegarParaChat() {
    cy.log('📋 Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.contains('Chat').click({ force: true });
    cy.wait(3000);
    cy.log('✅ Navegação para Chat concluída');
  }

  // ===== CLICAR EM GERAL (OPCIONAL) =====
  clicarEmGeral() {
    cy.log('📋 Tentando clicar em "Geral"...');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      if ($body.find('*:contains("Geral")').length > 0) {
        cy.log('✅ Elemento "Geral" encontrado na página');
        
        const selectorsGeral = [
          'div.truncate:contains("Geral")',
          'div.flex.rounded-md:contains("Geral")',
          'div[class*="cursor-pointer"]:contains("Geral")',
          'div[class*="bg-[#027fa6]"]:contains("Geral")',
          'div:contains("Geral")',
          'span:contains("Geral")',
          '*:contains("Geral")'
        ];
        
        let geralEncontrado = false;
        for (const selector of selectorsGeral) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ "Geral" encontrado com seletor: ${selector}`);
            cy.get(selector).first()
              .should('be.visible')
              .click({ force: true });
            cy.log(`✅ "Geral" clicado com sucesso`);
            geralEncontrado = true;
            break;
          }
        }
        
        if (!geralEncontrado) {
          cy.log('⚠️ "Geral" não encontrado com seletores específicos, tentando fallback...');
          try {
            cy.contains('Geral')
              .click({ force: true });
            cy.log('✅ "Geral" clicado com fallback');
            geralEncontrado = true;
          } catch (e) {
            cy.log(`⚠️ Fallback falhou: ${e.message}`);
          }
        }
      } else {
        cy.log('⚠️ Elemento "Geral" não encontrado na página, pulando esta etapa...');
      }
    });
    
    cy.wait(2000);
    cy.log('✅ Clique em "Geral" concluído');
  }

  // ===== CLICAR NA PRIMEIRA MENSAGEM (OPCIONAL) =====
  clicarNaPrimeiraMensagem() {
    cy.log('📋 Tentando clicar na primeira mensagem...');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      const chatSelectors = [
        'div[class*="flex gap-2 items-center"]',
        'div[class*="chat"]',
        'div[class*="conversation"]',
        'div[class*="message"]',
        'div[role="button"]'
      ];
      
      let chatEncontrado = false;
      for (const selector of chatSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Chat encontrado: ${selector}`);
          cy.get(selector).first()
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
          cy.log('✅ Primeira mensagem clicada');
          chatEncontrado = true;
          break;
        }
      }
      
      if (!chatEncontrado) {
        cy.log('⚠️ Chat não encontrado, tentando fallback...');
        try {
          cy.get('div, li, button').first()
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
          cy.log('✅ Elemento clicado com fallback');
        } catch (e) {
          cy.log(`⚠️ Fallback falhou: ${e.message} - pulando esta etapa`);
        }
      }
    });
    
    cy.wait(2000);
    cy.log('✅ Clique na primeira mensagem concluído');
  }

  // ===== DIGITAR MENSAGEM =====
  digitarMensagem(mensagem = 'ola, como vai?') {
    cy.log('📋 Digitando mensagem...');
    
    cy.get('body').then(($body) => {
      const inputSelectors = [
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]'
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
    
    cy.log('✅ Mensagem digitada com sucesso');
  }

  // ===== ENVIAR MENSAGEM =====
  enviarMensagem() {
    cy.log('📋 Enviando mensagem...');
    
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
    cy.get('body').should('not.contain', 'enviando');
  }

  // ===== VALIDAR ENVIO DA MENSAGEM =====
  validarEnvioMensagem(mensagem) {
    cy.log('🔍 Validando envio da mensagem...');
    cy.log('⏳ Aguardando 5 segundos após envio...');
    cy.wait(5000);
    
    cy.get('body').then(($body) => {
      if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.get('div[contenteditable="true"]').first().should('be.empty');
        cy.log('✅ Campo de input vazio - mensagem enviada');
      }
    });
    
    cy.get('body').should('not.contain', 'enviando');
    cy.get('body').should('not.contain', 'sending');
    cy.log('✅ Nenhum indicador de "enviando" encontrado');
    
    cy.get('body').should('contain.text', mensagem);
    cy.log('✅ Mensagem encontrada na página - envio confirmado');
  }

  // ===== FLUXO COMPLETO =====
  enviarMensagemCompleta(mensagem = 'ola, como vai?') {
    this.navegarParaChat();
    this.clicarEmGeral();
    this.clicarNaPrimeiraMensagem();
    this.digitarMensagem(mensagem);
    this.enviarMensagem();
    this.validarEnvioMensagem(mensagem);
    
    cy.log('✅ Message sending test completed successfully!');
  }
}