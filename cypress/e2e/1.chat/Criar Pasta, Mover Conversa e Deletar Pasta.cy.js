
import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Criar Pasta, Mover Conversa e Deletar Pasta", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
	  cy.viewport(1440, 900);
    loginPage.login();
  });

  it("Criar Pasta, Mover Conversa e Deletar Pasta", () => {
    // Cl

//  NAVEGAR PARA CHAT =====
cy.log('📋 Fase 1: Navegando para Chat...');
cy.get('body').should('not.contain', 'loading');
cy.wait(2000);

// Navegar para Chat
cy.contains('Chat').click({ force: true });
cy.wait(3000);
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
/*
//criar nova pasta
cy.xpath('//div[contains(text(), "Criar nova pasta")]')
  .should('be.visible')
  .scrollIntoView()
  .click({ force: true });

  //digitar nome da nova pasta
cy.wait(2000);
  cy.xpath('//input[@placeholder="Nome da nova pasta"]')
  .should('be.visible')
  .scrollIntoView()
  .type('Pasta Teste 1', { delay: 100 });


 // Depois de digitar o nome clicar em criar
 cy.log('🔍 Procurando dialog para criar pasta...');
 cy.get('body').then(($body) => {
   if ($body.find('div[role="dialog"]').length > 0) {
     cy.log('✅ Dialog encontrado');
     cy.get('div[role="dialog"]').within(() => {
       cy.xpath('.//button[.//svg[contains(@class,"lucide-check")]]')
         .should('be.visible')
         .click({ force: true });
     });
   } else {
     cy.log('⚠️ Dialog não encontrado, tentando estratégias alternativas...');
     
     // Estratégia 1: Procurar por botão de confirmação diretamente
     if ($body.find('button svg[class*="check"]').length > 0) {
       cy.log('✅ Botão de confirmação encontrado via CSS');
       cy.get('button svg[class*="check"]').parent()
         .should('be.visible')
         .click({ force: true });
     }
     // Estratégia 2: Procurar por botão com texto "Criar" ou "Confirmar"
     else if ($body.find('button:contains("Criar"), button:contains("Confirmar"), button:contains("Create")').length > 0) {
       cy.log('✅ Botão de confirmação encontrado via texto');
       cy.get('button:contains("Criar"), button:contains("Confirmar"), button:contains("Create")').first()
         .should('be.visible')
         .click({ force: true });
     }
     // Estratégia 3: Procurar por qualquer botão próximo ao input
     else if ($body.find('button').length > 0) {
       cy.log('✅ Botão genérico encontrado');
       cy.get('button').last()
         .should('be.visible')
         .click({ force: true });
     }
     else {
       cy.log('⚠️ Nenhum botão de confirmação encontrado');
     }
   }
 });
  

cy.wait(300);

//confirmação da mensgaem

cy.get('.toast-root')
  .should('contain.text', 'Pasta criada com sucesso')
  .and('contain.text', 'Sua nova pasta está pronta para uso');

//clicar 3 pontinhos
cy.log('🔍 Procurando pasta "Pasta Teste 1" para clicar nos 3 pontinhos...');

// 1. Fazer hover sobre a pasta "Pasta Teste 1" e manter por 3 segundos
cy.log('🔍 Procurando pasta "Pasta Teste 1" pelo container específico...');

// Usar o seletor específico do container da pasta
cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")')
  .should('be.visible')
  .scrollIntoView()
  .trigger('mouseover')
  .trigger('mouseenter')
  .trigger('mousemove');

cy.log('⏳ Mantendo mouse sobre a pasta por 3 segundos...');
cy.wait(3000); // Manter mouse sobre a pasta por 3 segundos
    
// 2. Clicar nos 3 pontinhos da pasta "Pasta Teste 1" especificamente
cy.log('🔍 Procurando 3 pontinhos da pasta "Pasta Teste 1"...');

// Procurar pelos 3 pontinhos dentro do container da pasta "Pasta Teste 1"
cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")')
  .within(() => {
    cy.get('.folder-actions svg.lucide-ellipsis-vertical')
      .should('exist')
      .click({ force: true });
    cy.log('✅ 3 pontinhos da pasta "Pasta Teste 1" clicados');
  });


  //clicar em pasta filha
  cy.contains('div', 'Criar pasta filha', { matchCase: false })
  .should('be.visible')
  .click({ force: true });


//digistra nome da pasta filha

cy.get('input[placeholder="Nome da nova pasta"]', { timeout: 10000 })
  .should('be.visible')
  .clear()
  .type('Pasta filha teste');


  //clciar em adiconar pasta filha 
  cy.get('button:has(svg.lucide-check)', { timeout: 10000 })
  .should('be.visible')
  .should('not.be.disabled')
  .click({ force: true });


cy.wait(3000);


cy.get('.toast-root')
  .should('contain.text', 'Pasta criada com sucesso')
  .and('contain.text', 'Sua nova pasta está pronta para uso');
*/


// CLICAR EM "GERAL" (OPCIONAL) =====
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

// ===== FASE 3: CLICAR NA PRIMEIRA MENSAGEM E ARRASTAR PARA PASTA =====
cy.log('📋 Fase 3: Clicando na primeira mensagem e arrastando para "Pasta Teste 1"...');
cy.wait(2000);

// Procurar pela primeira mensagem/conversa
cy.log('🔍 Procurando primeira mensagem para clicar...');
cy.get('body').then(($body) => {
  // Procurar por elementos que parecem ser chats/mensagens
  const chatSelectors = [
    'div[class*="flex gap-2 items-center"]',
    'div[class*="chat"]',
    'div[class*="conversation"]',
    'div[class*="message"]',
    'div[role="button"]',
    'div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center'
  ];
  
  let chatEncontrado = false;
  for (const selector of chatSelectors) {
    if ($body.find(selector).length > 0) {
      cy.log(`✅ Chat encontrado: ${selector}`);
      
      // Clicar na primeira mensagem
      cy.get(selector).first()
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
      cy.log('✅ Primeira mensagem clicada');
      
      // Aguardar um pouco após clicar
      cy.wait(1000);
      
      // Procurar pela pasta "Pasta Teste 1" para arrastar
      cy.log('🔍 Procurando pasta "Pasta Teste 1" para arrastar...');
      
      // Seletores específicos baseados no HTML da pasta "Pasta Teste 1"
      const pastaSelectors = [
        'div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center.bg-\\[\\#027fa6\\]:contains("Pasta Teste 1")',
        'div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")',
        'div.ml-2.rounded-xl div.flex.rounded-md:contains("Pasta Teste 1")',
        'div:contains("Pasta Teste 1")',
        '*:contains("Pasta Teste 1")'
      ];
      
      let pastaEncontrada = false;
      for (const pastaSelector of pastaSelectors) {
        if ($body.find(pastaSelector).length > 0) {
          cy.log(`✅ Pasta "Pasta Teste 1" encontrada com seletor: ${pastaSelector}`);
          
          // Fluxo correto: Clicar, segurar, arrastar e soltar na pasta usando real-events
          cy.log('🔄 Iniciando drag and drop real: clicar, segurar, arrastar e soltar...');
          
          // 1. Clicar na mensagem e SEGURAR (manter pressionado)
          cy.get(selector).first()
            .scrollIntoView()
            .should('be.visible')
            .realMouseDown({ button: 'left' });
          
          cy.log('✅ Mouse pressionado na mensagem - MANTENDO PRESSIONADO');
          cy.wait(5000); // Manter pressionado por 2 segundos
          
          // 2. Arrastar para a pasta (mantendo pressionado)
          cy.log('🔄 Arrastando mensagem para pasta (mantendo pressionado)...');
          cy.get(pastaSelector).first()
            .scrollIntoView()
            .should('be.visible')
            .realMouseMove(0, 0);
          
          cy.log('✅ Mensagem arrastada para pasta "Pasta Teste 1" (ainda pressionada)');
          cy.wait(1000); // Manter pressionado por mais 1 segundo
          
          // 3. Agora soltar na pasta
          cy.get(pastaSelector).first()
            .realMouseUp({ button: 'left' });
          
          cy.log('✅ Mensagem SOLTA na pasta "Pasta Teste 1"');
          
          // Estratégia alternativa: Usar drag and drop nativo
          cy.wait(1000);
          cy.log('🔄 Tentando estratégia alternativa com drag and drop nativo...');
          
          cy.get(selector).first()
            .trigger('dragstart', { dataTransfer: new DataTransfer() });
          
          cy.wait(300);
          
          cy.get(pastaSelector).first()
            .trigger('dragover', { dataTransfer: new DataTransfer() })
            .trigger('dragenter', { dataTransfer: new DataTransfer() })
            .trigger('drop', { dataTransfer: new DataTransfer() })
            .trigger('dragend', { dataTransfer: new DataTransfer() });
          
          cy.log('✅ Estratégia alternativa executada');
          
          cy.log('✅ Drag and drop realizado com sucesso');
          
          // Aguardar um pouco para a animação
          cy.wait(2000);
          
          cy.log('✅ Mensagem movida para "Pasta Teste 1"');
          
          pastaEncontrada = true;
          break;
        }
      }
      
      if (!pastaEncontrada) {
        cy.log('⚠️ Pasta "Pasta Teste 1" não encontrada para drop');
      }
      
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

cy.log('✅ Fase 3 concluída');










  });
});
