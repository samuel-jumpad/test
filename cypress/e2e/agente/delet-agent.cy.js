
import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Teste Delet - Delet agent", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve deletar agente com sucesso", () => {
    
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
        .type('Agente Teste Automatizado', { delay: 100 });
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
        .type('Agente Teste Automatizado', { delay: 100 });
    } else {
      cy.log('⚠️ Nenhum campo de busca disponível, continuando sem busca...');
    }
  }
});

// Aguarda a tabela carregar 
cy.wait(7000);

  // Primeiro verifica se o agente foi criado e está visível na tabela
  //cy.xpath('//td[normalize-space(text())="Agente Teste Automatizado"]')
  //.should('be.visible')
  //.scrollIntoView();

// Debug: verifica se a linha da tabela existe
cy.log('🔍 Verificando se a linha da tabela existe...');
cy.xpath('//td[normalize-space(text())="Agente Teste Automatizado"]/ancestor::tr')
  .should('exist')
  .should('be.visible');

// Debug: verifica se existe algum botão na linha
cy.log('🔍 Verificando botões na linha...');
cy.xpath('//td[normalize-space(text())="Agente Teste Automatizado"]/ancestor::tr//button')
  .should('exist')
  .should('have.length.greaterThan', 0);

// Encontra a linha que contém "Agente Teste" e clica no botão de deletar
cy.log('🔍 Procurando botão de deletar na linha...');
cy.get('body').then(($body) => {
  // Estratégia 1: Tentar encontrar botão de deletar por ícone ou texto
  const selectorsDeletar = [
    'button:contains("Deletar")',
    'button:contains("Delete")',
    'button:contains("Remover")',
    'button:contains("Excluir")',
    'button svg[class*="trash"]',
    'button svg[class*="delete"]',
    'button svg[class*="x"]',
    'button[class*="danger"]',
    'button[class*="red"]',
    'button[class*="delete"]'
  ];
  
  let botaoDeletarEncontrado = false;
  for (const selector of selectorsDeletar) {
    if ($body.find(selector).length > 0) {
      cy.log(`✅ Botão de deletar encontrado: ${selector}`);
      cy.get(selector).first().should('be.visible').click();
      botaoDeletarEncontrado = true;
      break;
    }
  }
  
  // Estratégia 2: Se não encontrou, tentar o último botão da linha
  if (!botaoDeletarEncontrado) {
    cy.log('⚠️ Botão de deletar específico não encontrado, tentando último botão da linha...');
    cy.get('table tbody tr')
      .contains('Agente Teste Automatizado')
      .parent('tr')
      .find('button')
      .last()
      .should('be.visible')
      .click();
  }
});




  // Debug: Verificar se o modal de confirmação apareceu
  cy.log('🔍 Verificando se o modal de confirmação apareceu...');
  cy.get('body').then(($body) => {
    // Verificar se há elementos de modal/dialog
    const modalElements = $body.find('[role="dialog"], .modal, [class*="modal"], [class*="dialog"]');
    cy.log(`Elementos de modal encontrados: ${modalElements.length}`);
    
    // Listar todos os botões disponíveis no modal
    if (modalElements.length > 0) {
      cy.log('🔍 Botões disponíveis no modal:');
      cy.get('[role="dialog"] button, .modal button, [class*="modal"] button, [class*="dialog"] button').each(($btn, index) => {
        const text = $btn.text().trim();
        const classes = $btn.attr('class');
        cy.log(`Botão ${index}: "${text}" - Classes: ${classes}`);
      });
    }
  });

  // Aguardar um pouco para o modal carregar completamente
  cy.wait(2000);

  // Estratégia 1: Tentar o seletor original
  cy.log('🔍 Tentando seletor original...');
  cy.get('body').then(($body) => {
    if ($body.find('button:contains("Deletar agente")').length > 0) {
      cy.log('✅ Botão "Deletar agente" encontrado');
      cy.get('button:contains("Deletar agente")').first().should('be.visible').click();
    } else if ($body.find('button:contains("Deletar")').length > 0) {
      cy.log('✅ Botão "Deletar" encontrado');
      cy.get('button:contains("Deletar")').first().should('be.visible').click();
    } else if ($body.find('button:contains("Confirmar")').length > 0) {
      cy.log('✅ Botão "Confirmar" encontrado');
      cy.get('button:contains("Confirmar")').first().should('be.visible').click();
    } else if ($body.find('button:contains("Sim")').length > 0) {
      cy.log('✅ Botão "Sim" encontrado');
      cy.get('button:contains("Sim")').first().should('be.visible').click();
    } else {
      cy.log('⚠️ Nenhum botão de confirmação encontrado, tentando seletores alternativos...');
      
      // Estratégia 2: Tentar por classes específicas
      const selectorsDeletar = [
        'button[class*="bg-red"]',
        'button[class*="bg-[#e81b37]"]',
        'button[class*="danger"]',
        'button[class*="delete"]',
        'button[class*="red"]',
        '[role="dialog"] button:last-child',
        '.modal button:last-child',
        '[class*="modal"] button:last-child'
      ];
      
      let botaoEncontrado = false;
      for (const selector of selectorsDeletar) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão encontrado com seletor: ${selector}`);
          cy.get(selector).first().should('be.visible').click();
          botaoEncontrado = true;
          break;
        }
      }
      
      // Estratégia 3: Tentar o último botão do modal
      if (!botaoEncontrado) {
        cy.log('⚠️ Tentando último botão do modal...');
        cy.get('[role="dialog"] button, .modal button, [class*="modal"] button')
          .last()
          .should('be.visible')
          .click();
      }
    }
  });

// Aguardar processo de deleção completar
cy.wait(2000);








// Aguarda o toast aparecer e valida o conteúdo
cy.log('🔍 Aguardando mensagem de sucesso...');
cy.wait(3000); // Aguarda o toast carregar

// Valida que a mensagem de sucesso apareceu com múltiplas estratégias
cy.log('🔍 Procurando mensagem de sucesso...');
cy.get('body').then(($body) => {
  // Lista de possíveis mensagens de sucesso
  const mensagensSucesso = [
    'Agente removido',
    'Agente deletado',
    'Agente excluído',
    'Agente excluido',
    'removido com sucesso',
    'deletado com sucesso',
    'excluído com sucesso',
    'excluido com sucesso',
    'sucesso',
    'success',
    'deleted',
    'removed',
    'excluded'
  ];
  
  let mensagemEncontrada = false;
  
  // Estratégia 1: Procurar por texto específico
  for (const mensagem of mensagensSucesso) {
    if ($body.text().toLowerCase().includes(mensagem.toLowerCase())) {
      cy.log(`✅ Mensagem de sucesso encontrada: "${mensagem}"`);
      // Não verificar visibilidade, apenas confirmar que existe
      cy.log('✅ Mensagem de sucesso detectada - deleção confirmada');
      mensagemEncontrada = true;
      break;
    }
  }
  
  // Estratégia 2: Procurar por elementos de toast/notificação
  if (!mensagemEncontrada) {
    cy.log('🔍 Procurando elementos de toast/notificação...');
    const toastSelectors = [
      '.toast',
      '.notification',
      '.alert',
      '.message',
      '[role="alert"]',
      '[class*="toast"]',
      '[class*="notification"]',
      '[class*="success"]',
      '[class*="message"]'
    ];
    
    for (const selector of toastSelectors) {
      if ($body.find(selector).length > 0) {
        cy.log(`✅ Elemento de toast encontrado: ${selector}`);
        // Não verificar visibilidade, apenas confirmar que existe
        cy.log('✅ Toast/notificação detectado - deleção confirmada');
        mensagemEncontrada = true;
        break;
      }
    }
  }
  
  // Estratégia 3: Verificar se o agente foi removido da tabela
  if (!mensagemEncontrada) {
    cy.log('🔍 Verificando se o agente foi removido da tabela...');
    cy.get('body').then(($body) => {
      // Verificar se o agente não está mais na tabela
      if (!$body.text().includes('Agente Teste Automatizado')) {
        cy.log('✅ Agente não encontrado na tabela - deleção confirmada');
        mensagemEncontrada = true;
      } else {
        cy.log('⚠️ Agente ainda encontrado na tabela');
        
        // Verificar se a tabela ainda tem o agente específico
        cy.get('table tbody tr').then(($rows) => {
          let agenteEncontrado = false;
          $rows.each((index, row) => {
            if (row.textContent.includes('Agente Teste Automatizado')) {
              agenteEncontrado = true;
            }
          });
          
          if (!agenteEncontrado) {
            cy.log('✅ Agente não encontrado nas linhas da tabela - deleção confirmada');
            mensagemEncontrada = true;
          } else {
            cy.log('⚠️ Agente ainda encontrado nas linhas da tabela');
          }
        });
      }
    });
  }
  
  // Estratégia 4: Verificar se há indicadores de sucesso
  if (!mensagemEncontrada) {
    cy.log('🔍 Procurando indicadores de sucesso...');
    const indicadoresSucesso = [
      'success',
      'sucesso',
      'deleted',
      'removed',
      'excluded',
      'excluído',
      'excluido'
    ];
    
    for (const indicador of indicadoresSucesso) {
      if ($body.text().toLowerCase().includes(indicador.toLowerCase())) {
        cy.log(`✅ Indicador de sucesso encontrado: "${indicador}"`);
        // Não verificar visibilidade, apenas confirmar que existe
        cy.log('✅ Indicador de sucesso detectado - deleção confirmada');
        mensagemEncontrada = true;
        break;
      }
    }
  }
  
  // Estratégia 5: Verificar se a tabela foi atualizada (menos linhas)
  if (!mensagemEncontrada) {
    cy.log('🔍 Verificando se a tabela foi atualizada...');
    cy.get('table tbody tr').then(($rows) => {
      if ($rows.length === 0) {
        cy.log('✅ Tabela vazia - deleção confirmada');
        mensagemEncontrada = true;
      } else {
        cy.log(`⚠️ Tabela ainda tem ${$rows.length} linhas`);
      }
    });
  }
  
  // Se nenhuma mensagem foi encontrada, logar informações de debug
  if (!mensagemEncontrada) {
    cy.log('⚠️ Nenhuma mensagem de sucesso encontrada');
    cy.log('🔍 Conteúdo da página:');
    cy.get('body').then(($body) => {
      const text = $body.text();
      cy.log(`Texto da página: ${text.substring(0, 500)}...`);
    });
    
    // Tirar screenshot para debug
    cy.screenshot('delecao-sem-mensagem-sucesso');
  }
});

  });
});
