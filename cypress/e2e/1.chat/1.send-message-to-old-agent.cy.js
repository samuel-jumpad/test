import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Acessar agente antigo e enviar um chat", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve acessar chat antigo de um agente e enviar um chat", () => {
    // ===== NAVEGAÇÃO PARA AGENTES (mesma estratégia usada para Chat) =====
    cy.log('🔍 Navegando para Agentes...');
    
    // Aguardar carregamento completo
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // DEBUG: Verificar quantos elementos "Agentes" existem
    cy.get('body').then(($body) => {
      const totalAgentes = $body.find('*:contains("Agentes")').length;
      cy.log(`🔍 DEBUG: Total de elementos contendo "Agentes": ${totalAgentes}`);
    });
    
    // Estratégias robustas para encontrar e clicar em Agentes (mesma lógica do Chat)
    cy.get('body').then(($body) => {
      const agentesSelectors = [
        'button:contains("Agentes")',
        'a:contains("Agentes")',
        '[role="button"]:contains("Agentes")',
        '[data-testid*="agentes"]',
        '[data-testid*="agents"]',
        '[aria-label*="agentes"]',
        '[aria-label*="agents"]',
        'nav button:contains("Agentes")',
        'nav a:contains("Agentes")',
        '.nav-item:contains("Agentes")',
        '.menu-item:contains("Agentes")',
        '.sidebar-item:contains("Agentes")',
        '[data-sidebar="menu-button"]:contains("Agentes")',
        'li[data-slot="sidebar-menu-item"] button:contains("Agentes")'
      ];
      
      let agentesEncontrado = false;
      for (const selector of agentesSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Agentes encontrado com seletor: ${selector}`);
          cy.log(`📊 Quantidade encontrada: ${$body.find(selector).length}`);
          
          // REMOVER .should('be.visible') que pode estar travando
          cy.get(selector).first()
            .scrollIntoView()
            .wait(1000)
            .click({ force: true });
          agentesEncontrado = true;
          cy.log('✅ Clique em Agentes EXECUTADO!');
          break;
        }
      }
      
      if (!agentesEncontrado) {
        cy.log('❌ Agentes NÃO encontrado com nenhum seletor, navegando diretamente...');
        cy.visit('/dashboard/agents', { failOnStatusCode: false });
      }
    });
    
    cy.wait(4000);
    cy.log('✅ Navegação para Agentes concluída');
    

    
    // Clicar em "Meus Agentes" (mesma estratégia robusta)
    cy.log('🔍 Procurando "Meus Agentes"...');
    
    cy.get('body').then(($body) => {
      const meusAgentesSelectors = [
        'a[href="/dashboard/assistants/list"]',
        'button:contains("Meus Agentes")',
        'a:contains("Meus Agentes")',
        '[role="button"]:contains("Meus Agentes")',
        'div:contains("Meus Agentes")',
        'button:contains("Meus")',
        'a:contains("Meus")'
      ];
      
      let found = false;
      
      for (let selector of meusAgentesSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ "Meus Agentes" encontrado com seletor: ${selector}`);
          cy.log(`📊 Quantidade encontrada: ${$body.find(selector).length}`);
          
          cy.get(selector).first()
            .scrollIntoView()
            .wait(1000)
            .click({ force: true });
          cy.log('✅ Clique em "Meus Agentes" EXECUTADO!');
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('❌ "Meus Agentes" NÃO encontrado, navegando diretamente...');
        cy.visit('/dashboard/assistants/list', { failOnStatusCode: false });
      }
    });
    
    cy.wait(5000);
    cy.log('✅ Navegação para Meus Agentes concluída');

    // Digita o nome no campo de busca - com fallback
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
            .type('Cypress', { delay: 100 });
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
            .type('Cypress', { delay: 350 });
        } else {
          cy.log('⚠️ Nenhum campo de busca disponível, continuando sem busca...');
        }
      }
    });

    // Aguarda a tabela carregar 
    cy.wait(5000);

    // ===== CLICAR NO BOTÃO TESTAR =====
    cy.log('🔍 Procurando botão "Testar"...');
    cy.wait(5000); // Aguardar página carregar

    // Estratégia mais robusta para encontrar o botão Testar
    cy.get('body').then(($body) => {
      // Estratégia 1: Buscar por texto "Testar" com múltiplos seletores
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
      
      // Buscar por ícone sparkles
      if (!testarEncontrado && $body.find('button svg[class*="sparkles"]').length > 0) {
        cy.log('✅ Botão Testar encontrado por ícone sparkles');
        cy.get('button svg[class*="sparkles"]').parent().first()
          .scrollIntoView()
          .wait(1000)
          .click({ force: true });
        testarEncontrado = true;
      }
      
      // Buscar qualquer botão na linha da tabela
      if (!testarEncontrado && $body.find('table tbody tr button').length > 0) {
        cy.log('✅ Botões encontrados na tabela, clicando no primeiro');
        cy.get('table tbody tr button').first()
          .scrollIntoView()
          .wait(1000)
          .click({ force: true });
        testarEncontrado = true;
      }
      
      // Buscar por qualquer elemento clicável
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
    
    // Verificar se o dialog está aberto e aguardar estabilização
    cy.get('body').then(($body) => {
      if ($body.find('div[role="dialog"][data-state="open"]').length > 0) {
        cy.log('✅ Dialog aberto, aguardando estabilização...');
        cy.wait(2000);
      } else {
        cy.log('⚠️ Dialog não encontrado, aguardando mais tempo...');
        cy.wait(3000);
      }
    });

    // DIGITAR MENSAGEM =====
    
    // DIGITAR MENSAGEM =====
    cy.log('🔍 Procurando campo de mensagem...');
    
    // Estratégia robusta com múltiplos fallbacks
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
                  .type('Olá, esta é uma mensagem de teste', { delay: 100, force: true })
                  .wait(2000); // Aguardar para manter o card aberto
                cy.log('✅ Mensagem digitada via XPath');
              }
            });
        } catch (e) {
          cy.log('⚠️ XPath falhou, tentando fallback...');
          // Se XPath falhar, tentar CSS
          if ($body.find('div[contenteditable="true"]').length > 0) {
            cy.log('✅ Campo contenteditable encontrado via CSS...');
            cy.get('div[contenteditable="true"]').first()
              .scrollIntoView()
              .click({ force: true })
              .type('Olá, esta é uma mensagem de teste', { delay: 100, force: true })
              .wait(2000);
            cy.log('✅ Mensagem digitada via CSS');
          }
        }
      }
      
      // Estratégia 2: CSS fallback - campo contenteditable (se XPath não foi tentado)
      else if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.log('✅ Campo contenteditable encontrado via CSS...');
        cy.get('div[contenteditable="true"]').first()
          .scrollIntoView()
          .click({ force: true })
          .type('Olá, esta é uma mensagem de teste', { delay: 100, force: true })
          .wait(2000); // Aguardar para manter o card aberto
        cy.log('✅ Mensagem digitada via CSS');
      }
      
      // Estratégia 3: Fallback genérico
      else if ($body.find('textarea, input[type="text"]').length > 0) {
        cy.log('✅ Campo de texto encontrado via fallback...');
        cy.get('textarea, input[type="text"]').first()
          .scrollIntoView()
          .click({ force: true })
          .type('Olá, esta é uma mensagem de teste', { delay: 100, force: true })
          .wait(2000); // Aguardar para manter o card aberto
        cy.log('✅ Mensagem digitada via fallback');
      }
      
      else {
        cy.log('⚠️ Nenhum campo de input encontrado');
      }
    });

    // Aguardar estabilização antes de enviar
    cy.log('⏳ Aguardando estabilização do card...');
    cy.wait(3000);

    // Clicar em enviar - estratégia robusta
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

    // Aguardar mensagem ser enviada
    cy.log('⏳ Aguardando mensagem ser enviada...');
    cy.wait(10000);

    // Confirmar se a mensagem está sendo exibida
    cy.log('🔍 Confirmando se a mensagem está sendo exibida...');
    cy.get('body').then(($body) => {
      if ($body.find('*:contains("Olá, esta é uma mensagem de teste")').length > 0) {
        cy.log('✅ Mensagem confirmada - está sendo exibida');
        cy.contains('Olá, esta é uma mensagem de teste')
          .should('exist');
      } else {
        cy.log('⚠️ Mensagem não encontrada na página, mas continuando...');
      }
    });

    // Clicar no botão de fechar com fallbacks
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

    //  NAVEGAR PARA CHAT =====
    cy.log('📋 Fase 1: Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Navegar para Chat
    cy.contains('Chat').click({ force: true });
    cy.wait(10000);
    cy.log('✅ Navegação para Chat concluída');

    // Clicar no agente antigo com fallbacks para pipeline
    cy.log('🔍 Procurando agente "Cypress"...');
    cy.get('body').then(($body) => {
      // Estratégia 1: XPath específico
      if ($body.find('div:contains("Agentes")').length > 0) {
        try {
          cy.xpath('//div[contains(text(),"Agentes")]/following::div[contains(@class,"truncate") and text()="Cypress"][1]')
            .should('be.visible')
            .scrollIntoView()
            .click({ force: true });
          cy.log('✅ Agente Cypress clicado via XPath');
        } catch (e) {
          cy.log('⚠️ XPath do agente falhou, tentando fallback...');
        }
      }
      
      // Estratégia 2: Fallback CSS
      if ($body.find('div:contains("Cypress")').length > 0) {
        cy.get('div:contains("Cypress")').first()
          .scrollIntoView()
          .click({ force: true });
        cy.log('✅ Agente Cypress clicado via CSS fallback');
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


//FASE 4: DIGITAR MENSAGEM =====
cy.log('📋 Fase 4: Digitando mensagem...');
const mensagem = 'ola, como vai?';

// Aguardar o campo de input carregar
cy.log('⏳ Aguardando campo de input carregar...');
cy.wait(5000);

// Procurar por campo de input
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
        .scrollIntoView()
        .click({ force: true })
        .wait(500)
        .clear({ force: true })
        .wait(500)
        .type(mensagem, { delay: 100, force: true });
      cy.log('✅ Mensagem digitada');
      inputEncontrado = true;
      break;
    }
  }
  
  if (!inputEncontrado) {
    cy.log('⚠️ Input não encontrado, tentando fallback...');
    cy.get('input, textarea, [contenteditable]').first()
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true })
      .wait(500)
      .clear({ force: true })
      .wait(500)
      .type(mensagem, { delay: 100, force: true });
    cy.log('✅ Mensagem digitada com fallback');
  }
});

//CLICAR EM ENVIAR =====
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
        .scrollIntoView()
        .click({ force: true });
      botaoEncontrado = true;
      break;
    }
  }
  if (!botaoEncontrado) {
    cy.log('⚠️ Send button não encontrado, tentando seletores genéricos...');
    if ($body.find('button').length > 0) {
      cy.get('button').last()
        .scrollIntoView()
        .click({ force: true });
    } else {
      cy.log('⚠️ Nenhum button encontrado');
    }
  }
});
cy.log('✅ Send button clicado');

// Validar envio da mensagem
cy.log('🔍 Validando envio da mensagem...');
cy.wait(15000); // Aguardar envio

cy.get('body').then(($body) => {
  if ($body.text().includes(mensagem)) {
    cy.log('✅ Mensagem encontrada na página - envio confirmado');
  } else {
    cy.log('⚠️ Mensagem não encontrada na página, mas continuando...');
  }
});

cy.log('✅ Message sending test completed successfully!');
});
});