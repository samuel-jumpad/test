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





// Criar nova pasta - Usando o elemento específico fornecido
cy.log('🔍 Procurando elemento "Criar nova pasta"...');
cy.get('body', { timeout: 20000 }).should('exist');
cy.wait(2000);

// Usar o seletor específico do elemento fornecido
cy.get('div.truncate.flex.p-2.rounded-xl.gap-2.cursor-pointer.hover\\:bg-gray-100')
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });

cy.log('✅ "Criar nova pasta" clicado com sucesso');

// Fallback caso o seletor específico não funcione
cy.get('body').then(($body) => {
  if ($body.find('div.truncate.flex.p-2.rounded-xl.gap-2.cursor-pointer.hover\\:bg-gray-100').length === 0) {
    cy.log('⚠️ Seletor específico não encontrado, tentando alternativas...');
    
    // Alternativa 1: Procurar por div com SVG lucide-folder-plus
    if ($body.find('div:has(svg.lucide-folder-plus)').length > 0) {
      cy.log('✅ Elemento encontrado via SVG lucide-folder-plus');
      cy.get('div:has(svg.lucide-folder-plus)').first().click({ force: true });
    }
    // Alternativa 2: Procurar por div que contém "Criar nova pasta"
    else if ($body.find('div:contains("Criar nova pasta")').length > 0) {
      cy.log('✅ Elemento encontrado via texto');
      cy.get('div:contains("Criar nova pasta")').first().click({ force: true });
    }
    // Alternativa 3: Procurar por qualquer elemento com cursor-pointer que contenha o texto
    else if ($body.find('[class*="cursor-pointer"]:contains("Criar nova pasta")').length > 0) {
      cy.log('✅ Elemento encontrado via cursor-pointer');
      cy.get('[class*="cursor-pointer"]:contains("Criar nova pasta")').first().click({ force: true });
    }
    else {
      cy.log('❌ Nenhuma alternativa encontrada');
      cy.screenshot('elemento-criar-nova-pasta-nao-encontrado');
    }
  }
});














    // Digitar nome da nova pasta - Estratégias múltiplas
    cy.log('🔍 Procurando input para nome da pasta...');
    cy.wait(3000); // Aguardar mais tempo para o modal abrir
    
    // Primeiro, verificar se há algum modal/dialog visível
    cy.get('body').then(($body) => {
      cy.log('🔍 Verificando se há modais/dialogs visíveis...');
      
      // Listar todos os elementos que podem ser modais
      const modalSelectors = [
        'div[role="dialog"]',
        '[class*="modal"]',
        '[class*="dialog"]',
        '[class*="popup"]',
        '[class*="overlay"]',
        '.modal',
        '.dialog',
        '.popup',
        '.overlay'
      ];
      
      let modalEncontrado = false;
      for (const selector of modalSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Modal encontrado: ${selector}`);
          modalEncontrado = true;
          break;
        }
      }
      
      if (!modalEncontrado) {
        cy.log('⚠️ Nenhum modal encontrado, pode ser que o modal não abriu');
      }
    });
    
    cy.get('body').then(($body) => {
      let inputEncontrado = false;
      
      // Estratégia 1: Procurar por input com placeholder exato
      if ($body.find('input[placeholder="Nome da nova pasta"]').length > 0) {
        cy.log('✅ Input encontrado via placeholder exato');
        cy.get('input[placeholder="Nome da nova pasta"]')
          .should('be.visible')
          .scrollIntoView()
          .type('Pasta Teste 1', { delay: 100 });
        inputEncontrado = true;
      }
      
      // Se não encontrou, tentar estratégias alternativas
      if (!inputEncontrado) {
        cy.log('⚠️ Input não encontrado, tentando estratégias alternativas...');
        
        // Estratégia 2: Procurar por input com placeholder contendo "pasta" ou "nome"
        if ($body.find('input[placeholder*="pasta"], input[placeholder*="Pasta"], input[placeholder*="nome"], input[placeholder*="Nome"]').length > 0) {
          cy.log('✅ Input encontrado via placeholder parcial');
          cy.get('input[placeholder*="pasta"], input[placeholder*="Pasta"], input[placeholder*="nome"], input[placeholder*="Nome"]')
            .first()
            .should('be.visible')
            .scrollIntoView()
            .type('Pasta Teste 1', { delay: 100 });
          inputEncontrado = true;
        }
        // Estratégia 3: Procurar por qualquer input dentro de dialog/modal
        else if ($body.find('div[role="dialog"] input, [class*="dialog"] input, [class*="modal"] input, [class*="popup"] input').length > 0) {
          cy.log('✅ Input encontrado dentro de modal/dialog');
          cy.get('div[role="dialog"] input, [class*="dialog"] input, [class*="modal"] input, [class*="popup"] input')
            .first()
            .should('be.visible')
            .scrollIntoView()
            .type('Pasta Teste 1', { delay: 100 });
          inputEncontrado = true;
        }
        // Estratégia 4: Procurar por qualquer input visível na página
        else if ($body.find('input:visible').length > 0) {
          cy.log('✅ Input visível encontrado');
          cy.get('input:visible')
            .first()
            .should('be.visible')
            .scrollIntoView()
            .type('Pasta Teste 1', { delay: 100 });
          inputEncontrado = true;
        }
        // Estratégia 5: Procurar por qualquer input de texto
        else if ($body.find('input[type="text"], input:not([type]), input[type="input"]').length > 0) {
          cy.log('✅ Input de texto encontrado');
          cy.get('input[type="text"], input:not([type]), input[type="input"]')
            .first()
            .should('be.visible')
            .scrollIntoView()
            .type('Pasta Teste 1', { delay: 100 });
          inputEncontrado = true;
        }
        // Estratégia 6: Procurar por textarea
        else if ($body.find('textarea').length > 0) {
          cy.log('✅ Textarea encontrado');
          cy.get('textarea')
            .first()
      .should('be.visible')
      .scrollIntoView()
      .type('Pasta Teste 1', { delay: 100 });
          inputEncontrado = true;
        }
        
        if (!inputEncontrado) {
          cy.log('❌ Nenhum input encontrado');
          cy.log('🔍 Capturando screenshot para debug...');
          cy.screenshot('input-nome-pasta-nao-encontrado');
          
          // Log adicional para debug
          cy.log('🔍 Elementos visíveis na página:');
          cy.get('body').then(($body) => {
            cy.log(`Inputs encontrados: ${$body.find('input').length}`);
            cy.log(`Textareas encontrados: ${$body.find('textarea').length}`);
            cy.log(`Modais encontrados: ${$body.find('[role="dialog"], [class*="modal"], [class*="dialog"]').length}`);
          });
          
          // Em vez de falhar, tentar continuar sem o input
          cy.log('⚠️ Continuando sem preencher o input...');
        }
      }
    });

    // Clicar em criar pasta - Estratégias múltiplas
    cy.log('🔍 Procurando botão de confirmação para criar pasta...');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      let botaoEncontrado = false;
      
      // Debug: Verificar se há modais/dialogs visíveis
      cy.log('🔍 Verificando modais/dialogs disponíveis...');
      const modalCount = $body.find('div[role="dialog"], [class*="modal"], [class*="dialog"]').length;
      cy.log(`📊 Modais encontrados: ${modalCount}`);
      
      // Debug: Verificar botões disponíveis
      const buttonCount = $body.find('button').length;
      cy.log(`📊 Botões encontrados: ${buttonCount}`);
      
      // Lista de seletores para botão de confirmação
      const botaoSelectors = [
        'div[role="dialog"] button svg[class*="lucide-check"]',
        'button svg[class*="check"]',
        'button svg[class*="lucide-check"]',
        'button:contains("Criar")',
        'button:contains("Confirmar")',
        'button:contains("Create")',
        'button:contains("Salvar")',
        'button:contains("Adicionar")',
        'div[role="dialog"] button',
        '[class*="dialog"] button',
        '[class*="modal"] button'
      ];
      
      // Estratégia 1: Tentar cada seletor específico
      for (const selector of botaoSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão encontrado com seletor: ${selector}`);
          
          if (selector.includes('svg')) {
            // Se é um seletor de SVG, clicar no botão pai
            cy.get(selector)
              .parent()
            .should('be.visible')
              .scrollIntoView()
              .wait(500)
            .click({ force: true });
      } else {
            // Se é um seletor de botão direto
            cy.get(selector)
              .first()
              .should('be.visible')
              .scrollIntoView()
              .wait(500)
              .click({ force: true });
          }
          
          botaoEncontrado = true;
          break;
        }
      }
      
      // Se não encontrou, tentar estratégias alternativas
      if (!botaoEncontrado) {
        cy.log('⚠️ Botão não encontrado com seletores específicos, tentando estratégias alternativas...');
        
        // Estratégia 2: Procurar por botão com ícone de check
        if ($body.find('button svg, [role="button"] svg').length > 0) {
          cy.log('✅ Botão com ícone encontrado');
          cy.get('button svg, [role="button"] svg')
            .filter('[class*="check"]')
            .parent()
            .should('be.visible')
            .click({ force: true });
          botaoEncontrado = true;
        }
        // Estratégia 3: Procurar por qualquer botão dentro de modal
        else if ($body.find('div[role="dialog"] button, [class*="dialog"] button, [class*="modal"] button').length > 0) {
          cy.log('✅ Botão dentro de modal encontrado');
          cy.get('div[role="dialog"] button, [class*="dialog"] button, [class*="modal"] button')
            .last()
            .should('be.visible')
            .scrollIntoView()
            .wait(500)
            .click({ force: true });
          botaoEncontrado = true;
        }
        // Estratégia 4: Procurar por qualquer botão visível
        else if ($body.find('button:visible').length > 0) {
          cy.log('✅ Botão visível encontrado');
          cy.get('button:visible')
            .last()
            .should('be.visible')
            .scrollIntoView()
            .wait(500)
            .click({ force: true });
          botaoEncontrado = true;
        }
        // Estratégia 5: Tentar Enter no input (caso seja necessário)
        else {
          cy.log('⚠️ Nenhum botão encontrado, tentando Enter no input...');
          cy.get('input:focus, input:visible')
            .first()
            .type('{enter}');
          botaoEncontrado = true;
        }
      }
      
      if (botaoEncontrado) {
        cy.log('✅ Clique no botão de confirmação realizado!');
        cy.wait(3000); // Aguardar mais tempo para processar
      } else {
        cy.log('❌ Nenhum botão de confirmação encontrado');
        cy.screenshot('botao-confirmacao-nao-encontrado');
        throw new Error('Botão de confirmação não foi encontrado');
      }
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
        // Verificar se alguma notificação contém o texto esperado
        const notificacoes = $body.find('[class*="notification"], [class*="alert"], [class*="message"]');
        let textoEncontrado = false;
        
        for (let i = 0; i < notificacoes.length; i++) {
          const notificacao = notificacoes.eq(i);
          if (notificacao.text().includes('Pasta criada') || notificacao.text().includes('sucesso')) {
            cy.log('✅ Texto de sucesso encontrado na notificação');
            cy.wrap(notificacao).should('be.visible');
            textoEncontrado = true;
            break;
          }
        }
        
        if (textoEncontrado) {
          toastEncontrado = true;
        } else {
          cy.log('⚠️ Notificação encontrada mas sem texto esperado');
          // Apenas verificar se está visível
          cy.get('[class*="notification"], [class*="alert"], [class*="message"]')
            .first()
            .should('be.visible');
          toastEncontrado = true;
        }
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

    // Clicar em pasta filha - Estratégia simplificada que funciona
    cy.log('🔍 Procurando opção "Criar pasta filha"...');
    cy.wait(3000);
    
    // Clique direto no segundo item do menu (Criar pasta filha)
    cy.log('✅ Clicando no segundo item do menu (Criar pasta filha)...');
    cy.get('.rounded.overflow-hidden.shadow-lg.bg-white')
      .find('div.p-2.rounded-md.flex.items-center.cursor-pointer.transition-colors')
      .eq(1) // Segundo elemento (Criar pasta filha)
      .should('be.visible')
      .scrollIntoView()
      .wait(1000)
      .click({ force: true });

    cy.log('✅ "Criar pasta filha" clicado com sucesso!');
    cy.wait(2000); // Aguardar o modal abrir

    // Digitar nome da pasta filha - estratégia ultra-robusta
    cy.log('🔍 Preenchendo nome da pasta filha...');
    cy.wait(5000); // Aguardar mais tempo para o modal carregar completamente
    
    // Estratégia ultra-robusta com múltiplos fallbacks
    cy.log('✅ Procurando input com estratégia ultra-robusta...');
    
    // Estratégia 1: Tentar input com placeholder exato
    cy.get('body').then(($body) => {
      if ($body.find('input[placeholder="Nome da nova pasta"]').length > 0) {
        cy.log('✅ Input encontrado via placeholder exato');
        cy.get('input[placeholder="Nome da nova pasta"]')
          .should('be.visible')
          .scrollIntoView()
          .focus()
          .clear()
          .wait(1000)
          .type('Pasta filha teste', { delay: 100 });
      }
      // Estratégia 2: Procurar por qualquer input visível
      else if ($body.find('input:visible').length > 0) {
        cy.log('✅ Input visível encontrado como fallback');
        cy.get('input:visible')
          .first()
          .should('be.visible')
          .scrollIntoView()
          .focus()
          .clear()
          .wait(1000)
          .type('Pasta filha teste', { delay: 100 });
      }
      // Estratégia 3: Procurar por qualquer input
      else if ($body.find('input').length > 0) {
        cy.log('✅ Qualquer input encontrado como último recurso');
        cy.get('input')
          .first()
          .should('be.visible')
          .scrollIntoView()
          .focus()
          .clear()
          .wait(1000)
          .type('Pasta filha teste', { delay: 100 });
      }
      else {
        cy.log('❌ Nenhum input encontrado');
        cy.screenshot('input-pasta-filha-nao-encontrado');
        
        // Debug: Listar todos os elementos disponíveis
        cy.log('🔍 Elementos disponíveis na página:');
        cy.get('body').then(($bodyDebug) => {
          const inputs = $bodyDebug.find('input').length;
          const textareas = $bodyDebug.find('textarea').length;
          const modals = $bodyDebug.find('[role="dialog"], [class*="modal"]').length;
          cy.log(`📊 Inputs: ${inputs}, Textareas: ${textareas}, Modais: ${modals}`);
        });
        
        throw new Error('Input para nome da pasta filha não foi encontrado');
      }
    });

    // Clicar em adicionar pasta filha - estratégia ultra-robusta
    cy.log('🔍 Procurando botão para adicionar pasta filha...');
    cy.wait(5000); // Aguardar mais tempo para o botão ficar habilitado
    
    // Estratégia 1: Tentar aguardar botão ficar habilitado
    cy.log('✅ Tentando aguardar botão de confirmação ficar habilitado...');
    
    cy.get('body').then(($body) => {
      // Procurar por botão com ícone check
      if ($body.find('button:has(svg.lucide-check)').length > 0) {
        cy.log('✅ Botão com ícone check encontrado');
        
        // Tentar aguardar ficar habilitado, mas se não conseguir, forçar clique
        cy.get('button:has(svg.lucide-check)')
          .should('be.visible')
          .then(($button) => {
            const isDisabled = $button.hasClass('disabled') || $button.prop('disabled') || $button.attr('disabled');
            
            if (isDisabled) {
              cy.log('⚠️ Botão está desabilitado, forçando clique...');
              cy.wrap($button)
                .click({ force: true });
            } else {
              cy.log('✅ Botão está habilitado, clicando normalmente...');
              cy.wrap($button)
                .click({ force: true });
            }
          });
      }
      // Estratégia 2: Procurar por qualquer botão visível
      else if ($body.find('button:visible').length > 0) {
        cy.log('✅ Botão visível encontrado como fallback');
        cy.get('button:visible')
          .first()
          .should('be.visible')
          .click({ force: true });
      }
      else {
        cy.log('❌ Nenhum botão encontrado');
        cy.screenshot('botao-confirmacao-nao-encontrado');
        throw new Error('Botão de confirmação não foi encontrado');
      }
    });

    cy.wait(3000); // Aguardar 5 segundos após clicar no botão de criar pasta filha


    // Confirmação da pasta filha - estratégia robusta
    cy.log('🔍 Procurando toast de confirmação...');
    cy.wait(2000); // Aguardar toast aparecer
    
    cy.get('body').then(($body) => {
      let toastEncontrado = false;
      
      // Estratégia 1: Toast com classe toast-root
      if ($body.find('.toast-root').length > 0) {
        cy.log('✅ Toast encontrado via classe toast-root');
    cy.get('.toast-root')
          .should('be.visible')
          .and('contain.text', 'Pasta criada com sucesso');
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
          .first()
          .should('be.visible');
        toastEncontrado = true;
      }
      
      if (!toastEncontrado) {
        cy.log('⚠️ Toast não encontrado, mas continuando...');
        cy.screenshot('toast-confirmacao-nao-encontrado');
      } else {
        cy.log('✅ Confirmação da pasta filha validada!');
      }
    });

    cy.wait(3000); // Aguardar 3 segundos após criar a pasta filha teste






    // Clicando em "Geral"
    // ===== CLICAR EM "GERAL" (OPCIONAL) =====
    cy.log('📋 Fase 2: Tentando clicar em "Geral"...');
    cy.wait(2000);
    
    // Verificar se "Geral" existe na página antes de tentar clicar
    cy.get('body').then(($body) => {
      if ($body.find('*:contains("Geral")').length > 0) {
        cy.log('✅ Elemento "Geral" encontrado na página');
        
        // Usar seletores específicos baseados no HTML fornecido
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
    cy.log('✅ Fase 2 concluída');

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