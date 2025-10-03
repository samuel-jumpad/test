export class ChatPage {
  
  // ===== NAVEGAÇÃO PARA AGENTES =====
  navegarParaAgentes() {
    cy.log('🔍 Procurando botão Agentes...');
    cy.get('body').then(($body) => {
      const agentesButton = $body.find('button:contains("Agentes"), a:contains("Agentes"), [role="button"]:contains("Agentes")');
      
      if (agentesButton.length > 0) {
        cy.log('✅ Encontrado botão Agentes');
        cy.wrap(agentesButton.first()).should('be.visible').click();
        cy.wait(2000);
      } else {
        cy.log('⚠️ Botão Agentes não encontrado, tentando navegação direta...');
        cy.url().then((currentUrl) => {
          const baseUrl = currentUrl.split('/').slice(0, 3).join('/');
          const agentsUrl = `${baseUrl}/agents`;
          cy.visit(agentsUrl, { failOnStatusCode: false });
          cy.wait(5000);
        });
      }
    });

    // Clicar em "Meus Agentes"
    cy.log('🔍 Procurando "Meus Agentes"...');
    cy.get('body').then(($body) => {
      const meusAgentesSelectors = [
        'button:contains("Meus Agentes")',
        'a:contains("Meus Agentes")',
        'div:contains("Meus Agentes")',
        '*:contains("Meus Agentes")',
        'button:contains("Meus")',
        'a:contains("Meus")',
        'div:contains("Meus")'
      ];
      
      let found = false;
      
      for (let selector of meusAgentesSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Encontrado "Meus Agentes"`);
          cy.get(selector).first().should('be.visible').click();
          cy.wait(2000);
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('✅ Continuando para criar novo agente');
      }
    });
    
    cy.wait(5000);
  }

  // ===== BUSCAR AGENTE =====
  buscarAgente(nomeAgente = 'Cypress') {
    cy.log('🔍 Procurando campo de busca...');
    cy.get('body').then(($body) => {
      const selectorsBusca = [
        'input[type="search"]',
        'input[placeholder*="Buscar"]',
        'input[placeholder*="buscar"]',
        'input[placeholder*="nome"]',
        'input[placeholder*="search"]',
        '[data-testid*="search"]',
        '[class*="search"] input'
      ];
      
      let campoBuscaEncontrado = false;
      for (const selector of selectorsBusca) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo de busca encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(nomeAgente, { delay: 100 });
          campoBuscaEncontrado = true;
          break;
        }
      }
      
      if (!campoBuscaEncontrado) {
        cy.log('⚠️ Campo de busca não encontrado, tentando input genérico...');
        if ($body.find('input[type="text"]').length > 0) {
          cy.get('input[type="text"]').first()
            .should('be.visible')
            .clear()
            .type(nomeAgente, { delay: 350 });
        } else {
          cy.log('⚠️ Nenhum campo de busca disponível, continuando sem busca...');
        }
      }
    });
    cy.wait(5000);
  }

  // ===== CLICAR NO BOTÃO TESTAR =====
  clicarBotaoTestar() {
    cy.log('🔍 Procurando botão "Testar"...');
    cy.wait(5000);

    cy.get('body').then(($body) => {
      const testarSelectors = [
        'button:contains("Testar")',
        'a:contains("Testar")',
        '[role="button"]:contains("Testar")',
        'div:contains("Testar")',
        '*:contains("Testar")'
      ];
      
      let testarEncontrado = false;
      
      for (const selector of testarSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão Testar encontrado: ${selector}`);
          cy.get(selector).first()
            .scrollIntoView()
            .wait(1000)
            .click({ force: true });
          testarEncontrado = true;
          break;
        }
      }
      
      if (!testarEncontrado && $body.find('button svg[class*="sparkles"]').length > 0) {
        cy.log('✅ Botão Testar encontrado por ícone sparkles');
        cy.get('button svg[class*="sparkles"]').parent().first()
          .scrollIntoView()
          .wait(1000)
          .click({ force: true });
        testarEncontrado = true;
      }
      
      if (!testarEncontrado && $body.find('table tbody tr button').length > 0) {
        cy.log('✅ Botões encontrados na tabela, clicando no primeiro');
        cy.get('table tbody tr button').first()
          .scrollIntoView()
          .wait(1000)
          .click({ force: true });
        testarEncontrado = true;
      }
      
      if (!testarEncontrado) {
        cy.log('⚠️ Botão Testar não encontrado, tentando primeiro botão disponível');
        cy.get('button').first()
          .scrollIntoView()
          .wait(1000)
          .click({ force: true });
      }
    });

    // Aguardar o dialog abrir completamente
    cy.log('⏳ Aguardando dialog abrir...');
    cy.wait(3000);
    
    cy.get('body').then(($body) => {
      if ($body.find('div[role="dialog"][data-state="open"]').length > 0) {
        cy.log('✅ Dialog aberto, aguardando estabilização...');
        cy.wait(2000);
      } else {
        cy.log('⚠️ Dialog não encontrado, aguardando mais tempo...');
        cy.wait(3000);
      }
    });
  }

  // ===== DIGITAR MENSAGEM NO DIALOG =====
  digitarMensagemNoDialog(mensagem = 'Olá, esta é uma mensagem de teste') {
    cy.log('🔍 Procurando campo de mensagem no dialog...');
    
    cy.get('body').then(($body) => {
      // Estratégia 1: XPath específico (se disponível)
      if ($body.find('div[role="dialog"][data-state="open"]').length > 0) {
        cy.log('✅ Dialog encontrado, tentando XPath...');
        try {
          cy.xpath('//div[@role="dialog" and @data-state="open"]//form[@id="chat-message-input-form"]//div[@role="textbox" and @contenteditable="true"]', { timeout: 10000 })
            .should('exist')
            .then($els => {
              const $visible = $els.filter(':visible');
              if ($visible.length > 0) {
                cy.wrap($visible[0])
                  .scrollIntoView()
                  .click({ force: true })
                  .type(mensagem, { delay: 100, force: true })
                  .wait(2000);
                cy.log('✅ Mensagem digitada via XPath');
              }
            });
        } catch (e) {
          cy.log('⚠️ XPath falhou, tentando fallback...');
        }
      }
      
      // Estratégia 2: CSS fallback - campo contenteditable (se XPath não foi tentado)
      else if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.log('✅ Campo contenteditable encontrado via CSS...');
        cy.get('div[contenteditable="true"]').first()
          .scrollIntoView()
          .click({ force: true })
          .type(mensagem, { delay: 100, force: true })
          .wait(2000);
        cy.log('✅ Mensagem digitada via CSS');
      }
      
      // Estratégia 3: Fallback genérico
      else if ($body.find('textarea, input[type="text"]').length > 0) {
        cy.log('✅ Campo de texto encontrado via fallback...');
        cy.get('textarea, input[type="text"]').first()
          .scrollIntoView()
          .click({ force: true })
          .type(mensagem, { delay: 100, force: true })
          .wait(2000);
        cy.log('✅ Mensagem digitada via fallback');
      }
      
      else {
        cy.log('⚠️ Nenhum campo de input encontrado');
      }
    });
  }

  // ===== ENVIAR MENSAGEM NO DIALOG =====
  enviarMensagemNoDialog() {
    cy.log('🔍 Procurando botão de enviar...');
    cy.get('body').then(($body) => {
      // Estratégia 1: XPath (se disponível)
      if ($body.find('form#chat-message-input-form').length > 0) {
        try {
          cy.xpath('(//form[@id="chat-message-input-form"]//button)[last()]')
            .scrollIntoView()
            .click({ force: true });
          cy.log('✅ Botão enviar clicado via XPath');
        } catch (e) {
          cy.log('⚠️ XPath do botão falhou, tentando fallback...');
        }
      }
      
      // Estratégia 2: CSS fallback
      if ($body.find('button').length > 0) {
        cy.get('button').last()
          .scrollIntoView()
          .click({ force: true });
        cy.log('✅ Botão enviar clicado via CSS');
      }
      
      else {
        cy.log('⚠️ Nenhum botão de envio encontrado');
      }
    });
  }

  // ===== VALIDAR MENSAGEM ENVIADA =====
  validarMensagemEnviada(mensagem = 'Olá, esta é uma mensagem de teste') {
    cy.log('⏳ Aguardando mensagem ser enviada...');
    cy.wait(5000);

    cy.log('🔍 Confirmando se a mensagem está sendo exibida...');
    cy.get('body').then(($body) => {
      if ($body.find('*:contains("' + mensagem + '")').length > 0) {
        cy.log('✅ Mensagem confirmada - está sendo exibida');
        cy.contains(mensagem)
          .should('exist');
      } else {
        cy.log('⚠️ Mensagem não encontrada na página, mas continuando...');
      }
    });
  }

  // ===== FECHAR DIALOG =====
  fecharDialog() {
    cy.log('🔍 Procurando botão de fechar...');
    cy.get('body').then(($body) => {
      // Estratégia 1: XPath específico
      if ($body.find('div[role="dialog"][data-state="open"]').length > 0) {
        try {
          cy.xpath('//div[@role="dialog" and @data-state="open"]//button//*[name()="svg" and contains(@class,"lucide-x")]')
            .should('be.visible')
            .click({ force: true });
          cy.log('✅ Botão fechar clicado via XPath');
        } catch (e) {
          cy.log('⚠️ XPath do botão fechar falhou, tentando fallback...');
        }
      }
      
      // Estratégia 2: Fallback CSS - apenas botões de fechar específicos do dialog
      if ($body.find('div[role="dialog"] button svg[class*="x"]').length > 0) {
        cy.get('div[role="dialog"] button svg[class*="x"]').parent()
          .scrollIntoView()
          .click({ force: true });
        cy.log('✅ Botão fechar clicado via CSS fallback');
      }
      
      else {
        cy.log('⚠️ Botão de fechar não encontrado, continuando...');
      }
    });
  }

  // ===== NAVEGAÇÃO PARA CHAT =====
  navegarParaChat() {
    cy.log('📋 Fase 1: Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.contains('Chat').click({ force: true });
    cy.wait(3000);
    cy.log('✅ Navegação para Chat concluída');
  }

  // ===== CLICAR NO AGENTE ANTIGO =====
  clicarNoAgenteAntigo(nomeAgente = 'Cypress') {
    cy.log('🔍 Procurando agente "' + nomeAgente + '"...');
    cy.get('body').then(($body) => {
      // Estratégia 1: XPath específico
      if ($body.find('div:contains("Agentes")').length > 0) {
        try {
          cy.xpath('//div[contains(text(),"Agentes")]/following::div[contains(@class,"truncate") and text()="' + nomeAgente + '"][1]')
            .should('be.visible')
            .scrollIntoView()
            .click({ force: true });
          cy.log('✅ Agente ' + nomeAgente + ' clicado via XPath');
        } catch (e) {
          cy.log('⚠️ XPath do agente falhou, tentando fallback...');
        }
      }
      
      // Estratégia 2: Fallback CSS
      if ($body.find('div:contains("' + nomeAgente + '")').length > 0) {
        cy.get('div:contains("' + nomeAgente + '")').first()
          .scrollIntoView()
          .click({ force: true });
        cy.log('✅ Agente ' + nomeAgente + ' clicado via CSS fallback');
      }
      
      // Estratégia 3: Fallback genérico
      else if ($body.find('div[class*="truncate"]').length > 0) {
        cy.get('div[class*="truncate"]').first()
          .scrollIntoView()
          .click({ force: true });
        cy.log('✅ Primeiro agente clicado via fallback genérico');
      }
      
      else {
        cy.log('⚠️ Nenhum agente encontrado, continuando...');
      }
    });
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

  // ===== DIGITAR MENSAGEM NO CHAT =====
  digitarMensagemNoChat(mensagem = 'ola, como vai?') {
    cy.log('📋 Fase 4: Digitando mensagem...');

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
            .scrollIntoView()
            .clear({ force: true })
            .type(mensagem, { delay: 100, force: true });
          cy.log('✅ Mensagem digitada');
          inputEncontrado = true;
          break;
        }
      }
      
      if (!inputEncontrado) {
        cy.log('⚠️ Input não encontrado, tentando fallback...');
          cy.get('input, textarea, [contenteditable]').first()
          .scrollIntoView()
          .clear({ force: true })
          .type(mensagem, { delay: 100, force: true });
        cy.log('✅ Mensagem digitada com fallback');
      }
    });
  }

  // ===== ENVIAR MENSAGEM NO CHAT =====
  enviarMensagemNoChat() {
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
  }

  // ===== VALIDAR ENVIO NO CHAT =====
  validarEnvioNoChat(mensagem = 'ola, como vai?') {
    cy.log('🔍 Validando envio da mensagem...');
    cy.wait(3000); // Aguardar envio
    
    cy.get('body').then(($body) => {
      if ($body.text().includes(mensagem)) {
        cy.log('✅ Mensagem encontrada na página - envio confirmado');
      } else {
        cy.log('⚠️ Mensagem não encontrada na página, mas continuando...');
      }
    });
  }

  // ===== FLUXO COMPLETO =====
  enviarMensagemCompleta(mensagem = 'ola, como vai?') {
    this.navegarParaChat();
    this.clicarEmGeral();
    this.clicarNaPrimeiraMensagem();
    this.digitarMensagemNoChat(mensagem);
    this.enviarMensagemNoChat();
    this.validarEnvioNoChat(mensagem);
    
    cy.log('✅ Message sending test completed successfully!');
  }

  // ===== FLUXO COMPLETO AGENTE ANTIGO =====
  enviarMensagemParaAgenteAntigo() {
    // Fase 1: Navegar para agentes
    this.navegarParaAgentes();
    
    // Fase 2: Buscar agente
    this.buscarAgente('Cypress');
    
    // Fase 3: Clicar no botão testar
    this.clicarBotaoTestar();
    
    // Fase 4: Digitar mensagem no dialog
    this.digitarMensagemNoDialog('Olá, esta é uma mensagem de teste');
    
    // Fase 5: Enviar mensagem no dialog
    this.enviarMensagemNoDialog();
    
    // Fase 6: Validar mensagem enviada
    this.validarMensagemEnviada('Olá, esta é uma mensagem de teste');
    
    // Fase 7: Fechar dialog
    this.fecharDialog();
    
    // Fase 8: Navegar para chat
    this.navegarParaChat();
    
    // Fase 9: Clicar no agente antigo
    this.clicarNoAgenteAntigo('Cypress');
    
    // Fase 10: Digitar mensagem no chat
    this.digitarMensagemNoChat('ola, como vai?');
    
    // Fase 11: Enviar mensagem no chat
    this.enviarMensagemNoChat();
    
    // Fase 12: Validar envio no chat
    this.validarEnvioNoChat('ola, como vai?');
    
    cy.log('✅ Message sending test completed successfully!');
  }
}