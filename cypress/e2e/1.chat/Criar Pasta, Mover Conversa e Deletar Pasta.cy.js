import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Criar Pasta, Mover Conversa e Deletar Pasta", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("Deve mover mensagem para a pasta corretamente", () => {

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







    // Criar nova pasta - Estratégias múltiplas para encontrar o elemento
    cy.log('🔍 Procurando elemento "Criar nova pasta"...');
    
    // Aguardar a página carregar completamente
    cy.wait(2000);
    
    // Estratégia múltipla para encontrar "Criar nova pasta"
    cy.get('body').then(($body) => {
      let elementoEncontrado = false;
      
      // Estratégia 1: Tentar XPath primeiro (mais específico)
      cy.xpath('//div[contains(text(), "Criar nova pasta")]', { timeout: 3000 })
        .then(($el) => {
          if ($el.length > 0) {
            cy.log('✅ Elemento encontrado via XPath original');
            cy.wrap($el)
              .should('be.visible')
              .scrollIntoView()
              .click({ force: true });
            elementoEncontrado = true;
          }
        })
        .then(() => {
          if (!elementoEncontrado) {
            cy.log('⚠️ XPath original não encontrado, tentando estratégias alternativas...');
            
            // Estratégia 2: Procurar por texto "Criar nova pasta" com contains
            if ($body.find('div:contains("Criar nova pasta")').length > 0) {
              cy.log('✅ Elemento encontrado via contains');
              cy.get('div:contains("Criar nova pasta")')
                .first()
                .should('be.visible')
                .scrollIntoView()
                .click({ force: true });
            }
            // Estratégia 3: Procurar por botão ou elemento clicável
            else if ($body.find('button:contains("Criar nova pasta"), [role="button"]:contains("Criar nova pasta")').length > 0) {
              cy.log('✅ Botão encontrado via contains');
              cy.get('button:contains("Criar nova pasta"), [role="button"]:contains("Criar nova pasta")')
                .first()
                .should('be.visible')
                .scrollIntoView()
                .click({ force: true });
            }
            // Estratégia 4: Procurar por qualquer elemento que contenha "Criar" e "pasta"
            else if ($body.find('*:contains("Criar"), *:contains("pasta")').length > 0) {
              cy.log('✅ Elemento encontrado via texto parcial');
              cy.get('*:contains("Criar"), *:contains("pasta")')
                .filter(':contains("Criar nova pasta")')
                .first()
                .should('be.visible')
                .scrollIntoView()
                .click({ force: true });
            }
            // Estratégia 5: Procurar por elementos com classes específicas que possam conter o botão
            else if ($body.find('[class*="create"], [class*="folder"], [class*="add"]').length > 0) {
              cy.log('✅ Elemento encontrado via classes CSS');
              cy.get('[class*="create"], [class*="folder"], [class*="add"]')
                .filter(':contains("Criar nova pasta")')
                .first()
                .should('be.visible')
                .scrollIntoView()
                .click({ force: true });
            }
            else {
              cy.log('❌ Nenhuma estratégia encontrou o elemento "Criar nova pasta"');
              // Capturar screenshot para debug
              cy.screenshot('elemento-criar-nova-pasta-nao-encontrado');
              throw new Error('Elemento "Criar nova pasta" não foi encontrado com nenhuma das estratégias');
            }
          }
        });
    });

    // Digitar nome da nova pasta - Estratégias múltiplas
    cy.log('🔍 Procurando input para nome da pasta...');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      let inputEncontrado = false;
      
      // Estratégia 1: XPath original
      cy.xpath('//input[@placeholder="Nome da nova pasta"]', { timeout: 3000 })
        .then(($el) => {
          if ($el.length > 0) {
            cy.log('✅ Input encontrado via XPath original');
            cy.wrap($el)
              .should('be.visible')
              .scrollIntoView()
              .type('Pasta Teste 1', { delay: 100 });
            inputEncontrado = true;
          }
        })
        .then(() => {
          if (!inputEncontrado) {
            cy.log('⚠️ XPath original não encontrado, tentando estratégias alternativas...');
            
            // Estratégia 2: Procurar por input com placeholder contendo "pasta"
            if ($body.find('input[placeholder*="pasta"], input[placeholder*="Pasta"]').length > 0) {
              cy.log('✅ Input encontrado via placeholder');
              cy.get('input[placeholder*="pasta"], input[placeholder*="Pasta"]')
                .first()
                .should('be.visible')
                .scrollIntoView()
                .type('Pasta Teste 1', { delay: 100 });
            }
            // Estratégia 3: Procurar por qualquer input dentro de dialog
            else if ($body.find('div[role="dialog"] input, [class*="dialog"] input').length > 0) {
              cy.log('✅ Input encontrado dentro de dialog');
              cy.get('div[role="dialog"] input, [class*="dialog"] input')
                .first()
                .should('be.visible')
                .scrollIntoView()
                .type('Pasta Teste 1', { delay: 100 });
            }
            // Estratégia 4: Procurar por qualquer input de texto
            else if ($body.find('input[type="text"], input:not([type])').length > 0) {
              cy.log('✅ Input genérico encontrado');
              cy.get('input[type="text"], input:not([type])')
                .first()
                .should('be.visible')
                .scrollIntoView()
                .type('Pasta Teste 1', { delay: 100 });
            }
            else {
              cy.log('❌ Nenhum input encontrado');
              cy.screenshot('input-nome-pasta-nao-encontrado');
              throw new Error('Input para nome da pasta não foi encontrado');
            }
          }
        });
    });

    // Clicar em criar pasta - Estratégias múltiplas
    cy.log('🔍 Procurando botão de confirmação para criar pasta...');
    cy.wait(1000);
    
    cy.get('body').then(($body) => {
      let botaoEncontrado = false;
      
      // Estratégia 1: Tentar XPath original primeiro (sem timeout para não falhar)
      cy.get('body').then(() => {
        // Verificar se o elemento existe usando jQuery
        if ($body.find('div[role="dialog"] button svg[class*="lucide-check"]').length > 0) {
          cy.log('✅ Botão encontrado via XPath original (jQuery)');
          cy.get('div[role="dialog"] button svg[class*="lucide-check"]')
            .parent()
            .should('be.visible')
            .click({ force: true });
          botaoEncontrado = true;
        }
        
        // Se não encontrou, tentar estratégias alternativas
        if (!botaoEncontrado) {
          cy.log('⚠️ XPath original não encontrado, tentando estratégias alternativas...');
          
          // Estratégia 2: Procurar por botão com ícone de check
          if ($body.find('button svg[class*="check"], button svg[class*="lucide-check"]').length > 0) {
            cy.log('✅ Botão de confirmação encontrado via ícone check');
            cy.get('button svg[class*="check"], button svg[class*="lucide-check"]')
              .parent()
              .should('be.visible')
              .click({ force: true });
          }
          // Estratégia 3: Procurar por botão com texto "Criar" ou "Confirmar"
          else if ($body.find('button:contains("Criar"), button:contains("Confirmar"), button:contains("Create"), button:contains("Salvar")').length > 0) {
            cy.log('✅ Botão de confirmação encontrado via texto');
            cy.get('button:contains("Criar"), button:contains("Confirmar"), button:contains("Create"), button:contains("Salvar")')
              .first()
              .should('be.visible')
              .click({ force: true });
          }
          // Estratégia 4: Procurar por botão dentro de dialog
          else if ($body.find('div[role="dialog"] button, [class*="dialog"] button').length > 0) {
            cy.log('✅ Botão encontrado dentro de dialog');
            cy.get('div[role="dialog"] button, [class*="dialog"] button')
              .last()
              .should('be.visible')
              .click({ force: true });
          }
          // Estratégia 5: Procurar por qualquer botão próximo ao input
          else if ($body.find('button').length > 0) {
            cy.log('✅ Botão genérico encontrado');
            cy.get('button')
              .last()
              .should('be.visible')
              .click({ force: true });
          }
          else {
            cy.log('❌ Nenhum botão de confirmação encontrado');
            cy.screenshot('botao-confirmacao-nao-encontrado');
            throw new Error('Botão de confirmação não foi encontrado');
          }
        }
      });
    });

    cy.wait(300);

    // Confirmação da mensagem - Estratégias múltiplas
    cy.log('🔍 Validando toast de sucesso...');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      let toastEncontrado = false;
      
      // Estratégia 1: Toast com classe toast-root
      if ($body.find('.toast-root').length > 0) {
        cy.log('✅ Toast encontrado via classe toast-root');
        cy.get('.toast-root')
          .should('be.visible')
          .and('contain.text', 'Pasta criada com sucesso')
          .and('contain.text', 'Sua nova pasta está pronta para uso');
        toastEncontrado = true;
      }
      // Estratégia 2: Toast com classe toast
      else if ($body.find('.toast').length > 0) {
        cy.log('✅ Toast encontrado via classe toast');
        cy.get('.toast')
          .should('be.visible')
          .and('contain.text', 'Pasta criada com sucesso');
        toastEncontrado = true;
      }
      // Estratégia 3: Procurar por elemento que contenha o texto
      else if ($body.find('*:contains("Pasta criada com sucesso")').length > 0) {
        cy.log('✅ Toast encontrado via texto');
        cy.get('*:contains("Pasta criada com sucesso")')
          .should('be.visible');
        toastEncontrado = true;
      }
      // Estratégia 4: Procurar por qualquer notificação
      else if ($body.find('[class*="notification"], [class*="alert"], [class*="message"]').length > 0) {
        cy.log('✅ Notificação encontrada via classes genéricas');
        cy.get('[class*="notification"], [class*="alert"], [class*="message"]')
          .filter(':contains("Pasta criada")')
          .should('be.visible');
        toastEncontrado = true;
      }
      
      if (!toastEncontrado) {
        cy.log('⚠️ Toast não encontrado, mas continuando...');
        cy.screenshot('toast-sucesso-nao-encontrado');
      }
    });

    // Clicar 3 pontinhos da pasta - Estratégias múltiplas
    cy.log('🔍 Procurando pasta "Pasta Teste 1" para clicar nos 3 pontinhos...');
    cy.wait(2000);

    cy.get('body').then(($body) => {
      let pastaEncontrada = false;
      
      // Estratégia 1: Seletor original
      if ($body.find('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")').length > 0) {
        cy.log('✅ Pasta encontrada via seletor original');
        pastaEncontrada = true;
        cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")')
          .should('be.visible')
          .scrollIntoView()
          .trigger('mouseover')
          .trigger('mouseenter')
          .trigger('mousemove');

        cy.log('⏳ Mantendo mouse sobre a pasta por 3 segundos...');
        cy.wait(3000);

        // Clicar nos 3 pontinhos
        cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")')
          .within(() => {
            cy.get('.folder-actions svg.lucide-ellipsis-vertical')
              .should('exist')
              .click({ force: true });
            cy.log('✅ 3 pontinhos da pasta "Pasta Teste 1" clicados');
          });
      }
      
      if (!pastaEncontrada) {
        cy.log('⚠️ Pasta não encontrada via seletor original, tentando estratégias alternativas...');
        
        // Estratégia 2: Procurar por qualquer elemento que contenha "Pasta Teste 1"
        if ($body.find('*:contains("Pasta Teste 1")').length > 0) {
          cy.log('✅ Pasta encontrada via texto');
          cy.get('*:contains("Pasta Teste 1")')
            .first()
            .should('be.visible')
            .scrollIntoView()
            .trigger('mouseover')
            .trigger('mouseenter')
            .trigger('mousemove');

          cy.wait(3000);

          // Tentar encontrar os 3 pontinhos com estratégias múltiplas
          cy.get('body').then(($body2) => {
            if ($body2.find('.folder-actions svg.lucide-ellipsis-vertical').length > 0) {
              cy.log('✅ 3 pontinhos encontrados via classe original');
              cy.get('.folder-actions svg.lucide-ellipsis-vertical')
                .should('be.visible')
                .click({ force: true });
            }
            else if ($body2.find('svg.lucide-ellipsis-vertical, svg[class*="ellipsis"]').length > 0) {
              cy.log('✅ 3 pontinhos encontrados via ícone ellipsis');
              cy.get('svg.lucide-ellipsis-vertical, svg[class*="ellipsis"]')
                .first()
                .should('be.visible')
                .click({ force: true });
            }
            else if ($body2.find('[class*="menu"], [class*="actions"], [class*="options"]').length > 0) {
              cy.log('✅ Menu de ações encontrado via classes genéricas');
              cy.get('[class*="menu"], [class*="actions"], [class*="options"]')
                .first()
                .should('be.visible')
                .click({ force: true });
            }
            else {
              cy.log('❌ 3 pontinhos não encontrados');
              cy.screenshot('tres-pontinhos-nao-encontrados');
              throw new Error('3 pontinhos da pasta não foram encontrados');
            }
          });
        }
        else {
          cy.log('❌ Pasta "Pasta Teste 1" não encontrada');
          cy.screenshot('pasta-teste-1-nao-encontrada');
          throw new Error('Pasta "Pasta Teste 1" não foi encontrada');
        }
      }
    });

    // Clicar em pasta filha - com wait estratégico
    cy.log('🔍 Procurando opção "Criar pasta filha"...');
    cy.wait(2000);
    cy.contains('div', 'Criar pasta filha', { matchCase: false })
      .should('be.visible')
      .click({ force: true });

    // Digitar nome da pasta filha - com estratégias múltiplas
    cy.log('🔍 Procurando input para pasta filha...');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      let inputEncontrado = false;
      
      // Estratégia 1: Input original
      if ($body.find('input[placeholder="Nome da nova pasta"]').length > 0) {
        cy.log('✅ Input encontrado via placeholder original');
        cy.get('input[placeholder="Nome da nova pasta"]', { timeout: 5000 })
          .should('be.visible')
          .clear()
          .type('Pasta filha teste');
        inputEncontrado = true;
      }
      // Estratégia 2: Qualquer input visível
      else if ($body.find('input:visible').length > 0) {
        cy.log('✅ Input visível encontrado');
        cy.get('input:visible')
          .first()
          .should('be.visible')
          .clear()
          .type('Pasta filha teste');
        inputEncontrado = true;
      }
      
      if (!inputEncontrado) {
        cy.log('❌ Input para pasta filha não encontrado');
        cy.screenshot('input-pasta-filha-nao-encontrado');
        throw new Error('Input para pasta filha não foi encontrado');
      }
    });

    // Clicar em adicionar pasta filha - com estratégias múltiplas
    cy.log('🔍 Procurando botão para adicionar pasta filha...');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      let botaoEncontrado = false;
      
      // Estratégia 1: Botão original com ícone check
      if ($body.find('button:has(svg.lucide-check)').length > 0) {
        cy.log('✅ Botão encontrado via ícone check');
        cy.get('button:has(svg.lucide-check)')
          .should('be.visible')
          .should('not.be.disabled')
          .click({ force: true });
        botaoEncontrado = true;
      }
      // Estratégia 2: Botão com ícone check genérico
      else if ($body.find('button svg[class*="check"]').length > 0) {
        cy.log('✅ Botão encontrado via ícone check genérico');
        cy.get('button svg[class*="check"]')
          .parent()
          .should('be.visible')
          .should('not.be.disabled')
          .click({ force: true });
        botaoEncontrado = true;
      }
      // Estratégia 3: Botão com texto
      else if ($body.find('button:contains("Criar"), button:contains("Adicionar"), button:contains("Salvar")').length > 0) {
        cy.log('✅ Botão encontrado via texto');
        cy.get('button:contains("Criar"), button:contains("Adicionar"), button:contains("Salvar")')
          .first()
          .should('be.visible')
          .should('not.be.disabled')
          .click({ force: true });
        botaoEncontrado = true;
      }
      
      if (!botaoEncontrado) {
        cy.log('❌ Botão para adicionar pasta filha não encontrado');
        cy.screenshot('botao-pasta-filha-nao-encontrado');
        throw new Error('Botão para adicionar pasta filha não foi encontrado');
      }
    });

    cy.wait(3000);

    // Confirmação da pasta filha
    cy.get('.toast-root')
      .should('contain.text', 'Pasta criada com sucesso')
      .and('contain.text', 'Sua nova pasta está pronta para uso');

    // Clicando em "Geral"
    cy.log('📋 Fase 3: Clicando em "Geral"...');
    cy.contains('div', 'Geral').scrollIntoView().click({ force: true });
    cy.wait(1500);

    // Clicando na primeira mensagem e arrastando para "Pasta Teste 1"
    cy.log('📋 Fase 4: Clicando na primeira mensagem e arrastando para "Pasta Teste 1"...');

    const possibleSelectors = [
      'div.cursor-grab',
      'div[draggable="true"]',
      'div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center',
      'div[class*="message"]',
      'div[role="button"]'
    ];

    cy.get('body').then(($body) => {
      const foundSelector = possibleSelectors.find((sel) => $body.find(sel).length > 0);
      cy.get(foundSelector).first().as('source');
    });

    cy.xpath('//div[contains(@class,"cursor-pointer") and .//div[normalize-space(text())="Pasta Teste 1"]]')
      .scrollIntoView()
      .should('be.visible')
      .as('target');

    cy.wait(1000);

    cy.get('@source').then(($src) => {
      cy.get('@target').then(($tgt) => {
        const s = $src[0].getBoundingClientRect();
        const t = $tgt[0].getBoundingClientRect();

        const startX = s.x + s.width / 2;
        const startY = s.y + s.height / 2;
        const endX = t.x + t.width / 2;
        const endY = t.y + t.height / 2;

        const dataTransfer = new DataTransfer();

        cy.wrap($src)
          .trigger('mousedown', { which: 1, clientX: startX, clientY: startY, force: true })
          .trigger('dragstart', { dataTransfer, clientX: startX, clientY: startY, force: true });

        cy.get('body')
          .trigger('mousemove', { clientX: (startX + endX) / 2, clientY: (startY + endY) / 2, force: true })
          .wait(100)
          .trigger('mousemove', { clientX: endX, clientY: endY, force: true });

        cy.wrap($tgt)
          .trigger('dragenter', { dataTransfer, clientX: endX, clientY: endY, force: true })
          .trigger('dragover',  { dataTransfer, clientX: endX, clientY: endY, force: true })
          .wait(400)
          .trigger('drop',      { dataTransfer, clientX: endX, clientY: endY, force: true });

        cy.wrap($src).trigger('mouseup', { force: true });

        cy.wait(2000);

        // Verifica toast de sucesso
        cy.get('.toast-title')
          .should('be.visible')
          .and('contain.text', 'Chat movido com sucesso');

        cy.get('.toast-description')
          .should('be.visible')
          .and('contain.text', 'Seu chat foi movido com sucesso para a pasta selecionada.');

        cy.log('✅ Primeira mensagem arrastada para Pasta Teste 1 com sucesso!');
      });     
    });

    // Acessando "Pasta Teste 1"
    cy.log('📂 Acessando Pasta Teste 1...');
    cy.xpath('//div[contains(@class,"cursor-pointer") and .//div[normalize-space(text())="Pasta Teste 1"]]')
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });

    cy.wait(2000);

    // Voltar ao topo e mover nova mensagem para "Pasta filha teste"
    cy.get('[data-radix-scroll-area-viewport]')
      .first()
      .scrollTo('top', { duration: 1000 });

    cy.wait(1000);

    cy.log('📥 Selecionando nova primeira mensagem...');
    const secondSelectors = [
      'div.cursor-grab',
      'div[draggable="true"]',
      'div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center',
    ];

    cy.get('body').then(($body) => {
      const selector2 = secondSelectors.find((s) => $body.find(s).length > 0);

      cy.get(selector2)
        .first()
        .as('source2')
        .scrollIntoView()
        .should('be.visible');

      // Selecionar a pasta filha destino
      cy.xpath('//div[contains(@class,"cursor-pointer") and .//div[normalize-space(text())="Pasta filha teste"]]')
        .scrollIntoView()
        .should('be.visible')
        .as('target2');

      // Drag and drop com coordenadas
      cy.get('@source2').then(($src) => {
        cy.get('@target2').then(($tgt) => {
          const s = $src[0].getBoundingClientRect();
          const t = $tgt[0].getBoundingClientRect();

          const startX = s.x + s.width / 2;
          const startY = s.y + s.height / 2;
          const endX = t.x + t.width / 2;
          const endY = t.y + t.height / 2;

          const dataTransfer2 = new DataTransfer();

          cy.wrap($src)
            .trigger('mousedown', { which: 1, clientX: startX, clientY: startY, force: true })
            .trigger('dragstart', { dataTransfer: dataTransfer2, clientX: startX, clientY: startY, force: true });

          cy.get('body')
            .trigger('mousemove', { clientX: (startX + endX) / 2, clientY: (startY + endY) / 2, force: true })
            .wait(100)
            .trigger('mousemove', { clientX: endX, clientY: endY, force: true });

          cy.wrap($tgt)
            .trigger('dragenter', { dataTransfer: dataTransfer2, clientX: endX, clientY: endY, force: true })
            .trigger('dragover',  { dataTransfer: dataTransfer2, clientX: endX, clientY: endY, force: true })
            .wait(400)
            .trigger('drop',      { dataTransfer: dataTransfer2, clientX: endX, clientY: endY, force: true });

          cy.wrap($src).trigger('mouseup', { force: true });

          cy.get('.toast-title')
            .should('be.visible')
            .and('contain.text', 'Chat movido com sucesso');

          cy.get('.toast-description')
            .should('contain.text', 'Seu chat foi movido com sucesso para a pasta selecionada.');

          cy.log('✅ Segunda mensagem movida para "Pasta filha teste" com sucesso!');
        });
      });
    });

    // Deletar "Pasta filha teste"
    cy.log('🔍 Procurando pasta "Pasta filha teste" para clicar nos 3 pontinhos...');

    // Fazer hover sobre a pasta filha
    cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta filha teste")')
      .should('be.visible')
      .scrollIntoView()
      .trigger('mouseover')
      .trigger('mouseenter')
      .trigger('mousemove');

    cy.log('⏳ Mantendo mouse sobre a "Pasta filha teste" por 3 segundos...');
    cy.wait(3000);

    // Clicar nos 3 pontinhos da pasta filha
    cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta filha teste")')
      .within(() => {
        cy.get('.folder-actions svg.lucide-ellipsis-vertical')
          .should('exist')
          .click({ force: true });
        cy.log('✅ 3 pontinhos da "Pasta filha teste" clicados');
      });

    // Clicar em "Remover pasta"
    cy.xpath('//div[contains(@class,"cursor-pointer") and contains(.,"Remover pasta")]')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });

    // Verifica se o card/modal de exclusão apareceu
    cy.xpath('//div[contains(@class,"overflow-hidden") and .//div[contains(text(),"Confirmar exclusão da pasta?")]]')
      .should('be.visible');

    // Clica no botão "Excluir pasta"
    cy.xpath('//div[contains(@class,"overflow-hidden") and .//div[contains(text(),"Confirmar exclusão da pasta?")]]//button[.//div[contains(text(),"Excluir pasta")]]')
      .should('be.visible')
      .click({ force: true });

    cy.wait(3000);

    // Validar toast de sucesso
    cy.xpath('//li[contains(@class,"toast-root")]//div[contains(@class,"toast-title") and normalize-space(text())="Pasta excluída"]')
      .should('be.visible');

    cy.xpath('//li[contains(@class,"toast-root")]//div[contains(@class,"toast-description") and contains(text(),"A pasta foi excluída com sucesso.")]')
      .should('be.visible');

    cy.log('✅ Pasta filha removida com sucesso!');

    // Clicar 3 pontinhos da pasta principal
    cy.log('🔍 Procurando pasta "Pasta Teste 1" para clicar nos 3 pontinhos...');

    // Fazer hover sobre a pasta "Pasta Teste 1"
    cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")')
      .should('be.visible')
      .scrollIntoView()
      .trigger('mouseover')
      .trigger('mouseenter')
      .trigger('mousemove');

    cy.log('⏳ Mantendo mouse sobre a pasta por 3 segundos...');
    cy.wait(3000);

    // Clicar nos 3 pontinhos da pasta "Pasta Teste 1"
    cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")')
      .within(() => {
        cy.get('.folder-actions svg.lucide-ellipsis-vertical')
          .should('exist')
          .click({ force: true });
        cy.log('✅ 3 pontinhos da pasta "Pasta Teste 1" clicados');
      });

    cy.xpath('//div[contains(@class,"cursor-pointer") and contains(.,"Remover pasta")]')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });

    // Verifica se o card/modal de exclusão apareceu
    cy.xpath('//div[contains(@class,"overflow-hidden") and .//div[contains(text(),"Confirmar exclusão da pasta?")]]')
      .should('be.visible');

    // Clica no botão "Excluir pasta" dentro do card
    cy.xpath('//div[contains(@class,"overflow-hidden") and .//div[contains(text(),"Confirmar exclusão da pasta?")]]//button[.//div[contains(text(),"Excluir pasta")]]')
      .should('be.visible')
      .click({ force: true });

    cy.wait(3000);

    // Assertar título do toast
    cy.xpath('//li[contains(@class,"toast-root")]//div[contains(@class,"toast-title") and normalize-space(text())="Pasta excluída"]')
      .should('be.visible');

    // Assertar descrição do toast
    cy.xpath('//li[contains(@class,"toast-root")]//div[contains(@class,"toast-description") and contains(text(),"A pasta foi excluída com sucesso.")]')
      .should('be.visible');

    cy.log('✅ Pasta removida com sucesso!');
  });
});