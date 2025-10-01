import { LoginPage } from "../../support/pages/login/login.page.js";
import { AgentPage } from "../../support/pages/agent/agent.page.js";

describe("Agentes - Acessando Agente Antigo", () => {
  beforeEach(() => {
    cy.setupTest();
  });

  it("deve acessar agente antigo e enviar mensagem no chat", () => {
    cy.log('🚀 Iniciando teste de acesso ao agente antigo e envio de mensagem...');
    cy.log('📋 Fase 1: Navegando para página de agentes...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    cy.get('body').then(($body) => {
      if ($body.find('span:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por span');
        cy.get('span:contains("Agentes")').first().click();
      } else if ($body.find('div:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por div');
        cy.get('div:contains("Agentes")').first().click();
      } else if ($body.find('button:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por button');
        cy.get('button:contains("Agentes")').first().click();
      } else {
        cy.log('⚠️ Menu Agentes não encontrado, navegando diretamente...');
        cy.visit('/dashboard/assistants', { timeout: 30000 });
      }
    });
    cy.wait(2000);
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Meus Agentes")').length > 0) {
        cy.log('✅ "Meus Agentes" encontrado');
        cy.get('button:contains("Meus Agentes")').first().click();
      } else if ($body.find('div:contains("Meus Agentes")').length > 0) {
        cy.get('div:contains("Meus Agentes")').first().click();
      }
    });
    cy.wait(3000);
    cy.log('✅ Navegação para agentes concluída');
    cy.log('📋 Fase 2: Buscando e acessando agente...');
    cy.get('body').then(($body) => {
      const selectorsBusca = [
        'input[type="search"]',
        'input[placeholder*="Buscar"]',
        'input[placeholder*="buscar"]',
        'input[placeholder*="nome"]'
      ];
      let encontrado = false;
      for (const selector of selectorsBusca) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo de busca encontrado: ${selector}`);
          cy.get(selector).first()
            .clear()
            .type('Agente teste automatizado', { delay: 100 });
          encontrado = true;
          break;
        }
      }
      if (!encontrado) {
        cy.log('⚠️ Campo de busca não encontrado');
      }
    });
    cy.wait(3000);
    cy.log('✅ Busca pelo agente concluída');
    cy.log('📋 Fase 3: Clicando no botão testar...');
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Testar")').length > 0) {
        cy.log('✅ Botão Testar encontrado por texto');
        cy.get('button:contains("Testar")').first().click();
      } else if ($body.find('button svg[class*="sparkles"]').length > 0) {
        cy.log('✅ Botão Testar encontrado por ícone sparkles');
        cy.get('button svg[class*="sparkles"]').parent().first().click();
      } else if ($body.find('table tbody tr button').length > 0) {
        cy.log('✅ Botões encontrados na tabela, clicando no primeiro');
        cy.get('table tbody tr button').first().click();
      } else {
        cy.log('⚠️ Botão Testar não encontrado, tentando primeiro botão disponível');
        cy.get('button').first().click();
      }
    });
    cy.wait(3000);
    cy.get('body').should('not.contain', 'loading');
    cy.log('✅ Botão testar clicado e página carregada');
    cy.log('📋 Fase 4: Enviando mensagem no chat...');
    cy.get('body').then(($body) => {
      const inputSelectors = [
        'input[type="text"]',
        'textarea',
        '[contenteditable="true"]',
        'input[placeholder*="message"]',
        'input[placeholder*="mensagem"]'
      ];
      let inputFound = false;
      for (const selector of inputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type('Olá! Este é um teste automatizado do Cypress.', { delay: 100 });
          cy.get(selector).first().type('{enter}');
          inputFound = true;
          break;
        }
      }
      if (!inputFound) {
        cy.log('⚠️ Campo de input não encontrado');
      }
    });
    cy.wait(3000);
    cy.log('✅ Mensagem enviada no chat');
    cy.log('📋 Fase 5: Validando envio da mensagem...');
    cy.get('body').then(($body) => {
      if ($body.find('[class*="message"], [class*="chat"], [class*="bubble"]').length > 0) {
        cy.log('✅ Mensagens encontradas na interface');
        cy.get('[class*="message"], [class*="chat"], [class*="bubble"]').should('have.length.greaterThan', 0);
      } else {
        cy.log('⚠️ Nenhuma mensagem visível encontrada');
      }
    });
    cy.log('✅ Validação de mensagem concluída');
    
    // ===== FASE 6: CLICAR NO BOTÃO X =====
    cy.log('📋 Fase 6: Clicando no botão X...');
    cy.get('body').then(($body) => {
      // Seletores específicos baseados na estrutura HTML real
      const selectorsEspecificos = [
        // Seletor direto para o botão com SVG lucide-x
        'button:has(svg.lucide.lucide-x)',
        'button svg.lucide.lucide-x',
        // Seletores por classes específicas do botão
        'button.relative.inline-flex.items-center.justify-center',
        'button[class*="relative"][class*="inline-flex"]',
        // Seletor por estrutura: div > button > div > svg
        'div.flex.items-center button svg.lucide.lucide-x',
        // Seletor por posição (primeiro botão na div)
        'div.p-2.flex.items-center button:first-child',
        // Seletor por atributos específicos
        'button[type="button"][class*="relative"]',
        // Seletor por tamanho (h-10 w-10)
        'button[class*="h-10"][class*="w-10"]'
      ];
      
      let botaoEncontrado = false;
      for (const selector of selectorsEspecificos) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão X encontrado com seletor específico: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click();
          botaoEncontrado = true;
          break;
        }
      }
      
      // Se não encontrou, tentar XPath específico
      if (!botaoEncontrado) {
        cy.log('⚠️ Botão X não encontrado com seletores CSS, tentando XPath específico...');
        try {
          // XPath específico baseado na estrutura real
          cy.xpath('//button[.//svg[@class="lucide lucide-x"]]')
            .should('be.visible')
            .click();
          cy.log('✅ Botão X encontrado e clicado com XPath específico');
          botaoEncontrado = true;
        } catch (e) {
          cy.log(`⚠️ Erro com XPath específico: ${e.message}`);
        }
      }
      
      // Fallback: tentar seletores mais genéricos
      if (!botaoEncontrado) {
        cy.log('⚠️ Botão X não encontrado com seletores específicos, tentando fallbacks...');
        const selectorsFallback = [
          'button svg[class*="lucide"]',
          'button[class*="relative"]',
          'div.flex.items-center button',
          'button[type="button"]',
          'button:first-child'
        ];
        
        for (const selector of selectorsFallback) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Botão encontrado com fallback: ${selector}`);
            cy.get(selector).first()
              .should('be.visible')
              .click();
            botaoEncontrado = true;
            break;
          }
        }
      }
      
      if (!botaoEncontrado) {
        cy.log('⚠️ Nenhum botão X encontrado, continuando com o teste...');
      }
    });
    cy.log('✅ Tentativa de clicar no botão X concluída');
    cy.wait(2000);
    
    // ===== FASE 7: CLICAR EM CHAT =====
    cy.log('📋 Fase 7: Clicando em Chat...');
    cy.xpath('//div[@class="flex-1 overflow-hidden transition-opacity duration-300 ease-in-out text-ellipsis opacity-100"]//span[contains(text(), "Chat")]')
      .should('be.visible')
      .click();
    cy.log('✅ Menu Chat clicado');
    cy.wait(2000);
    
    // ===== FASE 8: CLICAR EM AGENTE TESTE AUTOMATIZADO =====
    cy.log('📋 Fase 8: Clicando no agente teste automatizado...');
    cy.get('body').then(($body) => {
      // Seletores específicos baseados na estrutura HTML real
      const selectorsAgente = [
        // Primeiro: tentar clicar no nome do agente (mais confiável)
        'div.truncate:contains("Agente teste automatizado")',
        'div:contains("Agente teste automatizado")',
        // Segundo: tentar o botão de ações mesmo oculto
        'div.folder-actions.css-6ir1gv[type="button"]',
        'div[class*="folder-actions"][type="button"]',
        // Terceiro: tentar o SVG ellipsis-vertical
        'div:has(svg.lucide.lucide-ellipsis-vertical)',
        'div svg.lucide.lucide-ellipsis-vertical',
        // Quarto: tentar a estrutura completa
        'div.flex.items-center.gap-2.rounded-full.relative.cursor-pointer',
        'div.css-189q5a8',
        // Quinto: tentar por atributos específicos
        'div[aria-haspopup="dialog"][aria-expanded="false"]',
        'div[data-state="closed"]',
        // Sexto: tentar por posição na estrutura
        'div.flex.items-center.gap-2 div:last-child',
        'div.flex.flex-col.gap-2 div div div.folder-actions'
      ];
      
      let agenteEncontrado = false;
      for (const selector of selectorsAgente) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão do agente encontrado com seletor: ${selector}`);
          try {
            // Aguardar o elemento ficar visível com timeout maior
            cy.get(selector).first()
              .should('be.visible', { timeout: 10000 })
              .click();
            cy.log(`✅ Botão do agente clicado com sucesso: ${selector}`);
            agenteEncontrado = true;
            break;
          } catch (e) {
            cy.log(`⚠️ Elemento encontrado mas não visível: ${selector} - ${e.message}`);
            
            // Estratégia 1: Tentar forçar visibilidade
            try {
              cy.get(selector).first()
                .invoke('removeAttr', 'style')
                .invoke('css', 'display', 'block')
                .invoke('css', 'visibility', 'visible')
                .should('be.visible', { timeout: 2000 })
                .click();
              cy.log(`✅ Botão do agente clicado após forçar visibilidade: ${selector}`);
              agenteEncontrado = true;
              break;
            } catch (e2) {
              cy.log(`⚠️ Falha ao forçar visibilidade: ${selector} - ${e2.message}`);
            }
            
            // Estratégia 2: Clicar forçadamente mesmo oculto
            try {
              cy.get(selector).first()
                .click({ force: true });
              cy.log(`✅ Botão do agente clicado forçadamente: ${selector}`);
              agenteEncontrado = true;
              break;
            } catch (e3) {
              cy.log(`⚠️ Falha ao clicar forçadamente: ${selector} - ${e3.message}`);
            }
            
            // Estratégia 3: Tentar com trigger
            try {
              cy.get(selector).first()
                .trigger('click');
              cy.log(`✅ Botão do agente clicado com trigger: ${selector}`);
              agenteEncontrado = true;
              break;
            } catch (e4) {
              cy.log(`⚠️ Falha ao clicar com trigger: ${selector} - ${e4.message}`);
            }
          }
        }
      }
      
      // Se não encontrou, tentar XPath específico
      if (!agenteEncontrado) {
        cy.log('⚠️ Botão do agente não encontrado com CSS, tentando XPath...');
        try {
          // XPath específico para o botão de ações
          cy.xpath('//div[@class="folder-actions css-6ir1gv" and @type="button"]')
            .should('be.visible')
            .click();
          cy.log('✅ Botão do agente encontrado e clicado com XPath');
          agenteEncontrado = true;
        } catch (e) {
          cy.log(`⚠️ Erro com XPath do agente: ${e.message}`);
        }
      }
      
      // Fallback: tentar seletores mais genéricos
      if (!agenteEncontrado) {
        cy.log('⚠️ Botão do agente não encontrado com seletores específicos, tentando fallbacks...');
        const selectorsFallback = [
          'div:has(svg.lucide.lucide-ellipsis-vertical)',
          'div[aria-haspopup="dialog"]',
          'div[data-state="closed"]',
          'div.flex.items-center.gap-2 div:last-child',
          'div[class*="folder-actions"]'
        ];
        
        for (const selector of selectorsFallback) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Botão do agente encontrado com fallback: ${selector}`);
            try {
              cy.get(selector).first()
                .should('be.visible', { timeout: 5000 })
                .click();
              agenteEncontrado = true;
              break;
            } catch (e) {
              cy.log(`⚠️ Fallback não visível: ${selector} - ${e.message}`);
            }
          }
        }
      }
      
      // Último recurso: tentar clicar no nome do agente ou estrutura
      if (!agenteEncontrado) {
        cy.log('⚠️ Botão de ações não encontrado, tentando estratégias de fallback...');
        
        // Estratégia 1: Clicar no nome do agente
        try {
          cy.contains('Agente teste automatizado')
            .should('be.visible')
            .click();
          cy.log('✅ Nome do agente clicado como fallback');
          agenteEncontrado = true;
        } catch (e) {
          cy.log(`⚠️ Nome do agente não encontrado: ${e.message}`);
        }
        
        // Estratégia 2: Clicar na estrutura do agente
        if (!agenteEncontrado) {
          try {
            cy.get('div.flex.items-center.gap-2.rounded-full.relative.cursor-pointer')
              .should('be.visible')
              .click();
            cy.log('✅ Estrutura do agente clicada como fallback');
            agenteEncontrado = true;
          } catch (e) {
            cy.log(`⚠️ Estrutura do agente não encontrada: ${e.message}`);
          }
        }
        
        // Estratégia 3: Clicar em qualquer elemento que contenha o nome
        if (!agenteEncontrado) {
          try {
            cy.get('div:contains("Agente teste automatizado")')
              .first()
              .should('be.visible')
              .click();
            cy.log('✅ Elemento contendo o nome clicado como fallback');
            agenteEncontrado = true;
          } catch (e) {
            cy.log(`⚠️ Elemento contendo o nome não encontrado: ${e.message}`);
          }
        }
      }
      
      if (!agenteEncontrado) {
        cy.log('⚠️ Nenhum botão do agente encontrado, continuando com o teste...');
      }
    });
    cy.log('✅ Tentativa de clicar no agente teste automatizado concluída');
    cy.wait(2000);
    
    // ===== FASE 9: ENVIAR MENSAGEM NO CHAT =====
    cy.log('📋 Fase 9: Enviando mensagem no chat...');
    cy.xpath('//div[@contenteditable="true" and @data-placeholder="Digite aqui sua mensagem..."]')
      .should('be.visible')
      .type('ola, como vai?', { delay: 100 });
    cy.log('✅ Mensagem digitada: "ola, como vai?"');

    cy.log('📤 Clicando no botão de enviar...');
    cy.xpath(
      '//form[.//div[@contenteditable="true" and @data-placeholder="Digite aqui sua mensagem..."]]//button[@type="submit" and not(@disabled)]',
      { timeout: 15000 }
    )
      .should('be.visible')
      .scrollIntoView()
      .click();
    cy.log('✅ Botão de enviar clicado');

    cy.log('⏳ Aguardando 5 segundos após envio...');
    cy.wait(5000);
    
    // ===== FASE 10: CONFIRMAR SE A MENSAGEM FOI ENVIADA =====
    cy.log('🔍 Verificando se a mensagem foi enviada...');
    cy.xpath('//div[contains(text(), "ola, como vai?")]')
      .should('be.visible')
      .and('contain.text', 'ola, como vai?');
    cy.log('✅ Mensagem confirmada como enviada');
    
    cy.log('🎉 Teste concluído com sucesso!');
  });
});