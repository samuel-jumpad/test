import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Teste Creat - Criar Agente", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve criar agente com sucesso", () => {
    
    // Navegar para a seção de Agentes
    cy.log('🔍 Navegando para seção de Agentes...');
    
    // Estratégia 1: Tentar encontrar botão Agentes na navegação
    cy.get('body').then(($body) => {
      // Procurar por botão ou link com texto "Agentes"
      const agentesButton = $body.find('button:contains("Agentes"), a:contains("Agentes"), [role="button"]:contains("Agentes")');
      
      if (agentesButton.length > 0) {
        cy.log('✅ Encontrado botão Agentes');
        cy.wrap(agentesButton.first()).should('be.visible').click();
        cy.wait(2000);
      } else {
        cy.log('⚠️ Botão Agentes não encontrado, tentando navegação direta...');
        
        // Estratégia 2: Navegação direta para página de agentes
        cy.url().then((currentUrl) => {
          const baseUrl = currentUrl.split('/').slice(0, 3).join('/');
          
          // Tentar diferentes possíveis URLs para agentes
          const possibleUrls = [
            `${baseUrl}/agents`,
            `${baseUrl}/agentes`, 
            `${baseUrl}/dashboard/agents`,
            `${baseUrl}/dashboard/agentes`
          ];
          
          let navigated = false;
          for (let i = 0; i < possibleUrls.length && !navigated; i++) {
            cy.log(`Tentando navegar para: ${possibleUrls[i]}`);
            cy.visit(possibleUrls[i], { failOnStatusCode: false });
            cy.wait(3000);
            
            cy.url().then((newUrl) => {
              if (newUrl.includes('agents') || newUrl.includes('agentes')) {
                cy.log(`✅ Navegação bem-sucedida para: ${newUrl}`);
                navigated = true;
              }
            });
          }
        });
      }
    });

    // Aguardar carregamento da página de agentes
    cy.wait(3000);
    
    // Verificar se estamos na página correta
    cy.url().then((url) => {
      if (!url.includes('agents') && !url.includes('agentes') && !url.includes('assistants')) {
        cy.log('⚠️ Navegando para página de agentes...');
        
        // Tentar navegar diretamente para a página de agentes
        const baseUrl = url.split('/').slice(0, 3).join('/');
        const agentsUrl = `${baseUrl}/agents`;
        
        cy.visit(agentsUrl, { failOnStatusCode: false });
        cy.wait(5000);
      }
    });
    
    // Clicar em "Meus Agentes"
    cy.log('🔍 Procurando "Meus Agentes"...');
    
    cy.get('body').then(($body) => {
      // Procurar por "Meus Agentes" com seletores simples
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
      
      // Tentar cada seletor CSS apenas
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

    // Procurar e clicar no botão "Cadastrar Novo Agente"
    cy.log('🔍 Procurando botão "Cadastrar Novo Agente"...');
    cy.wait(3000);
    
    cy.get('body').then(($body) => {
      // Lista de seletores para o botão de criar agente (baseado nos logs)
      const criarAgenteSelectors = [
        // Textos encontrados nos logs
        'div:contains("Criar novo agente")',
        'button:contains("Criar novo agente")',
        '*:contains("Criar novo agente")',
        
        // Variações de texto
        'button:contains("Cadastrar Novo Agente")',
        'div:contains("Cadastrar Novo Agente")',
        '*:contains("Cadastrar Novo Agente")',
        'button:contains("Novo Agente")',
        'button:contains("Criar Agente")',
        'button:contains("Adicionar Agente")',
        'button:contains("Novo")',
        'button:contains("Criar")',
        'button:contains("+")',
        
        // Seletores por atributos
        '[data-testid*="create-agent"]',
        '[data-testid*="new-agent"]',
        '[data-testid*="add-agent"]',
        'button[aria-label*="criar"]',
        'button[aria-label*="novo"]'
      ];
      
      let found = false;
      for (let selector of criarAgenteSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Encontrado botão "Cadastrar Novo Agente"`);
          cy.get(selector).first().should('be.visible').click();
          cy.wait(2000);
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('⚠️ Botão não encontrado, tentando abordagem alternativa...');
        
        // Última tentativa: procurar qualquer elemento que contenha essas palavras
        cy.get('body').then(($body) => {
          const criarElements = $body.find('*:contains("criar"), *:contains("novo"), *:contains("Criar"), *:contains("Novo")');
          if (criarElements.length > 0) {
            cy.log('✅ Encontrado botão alternativo');
            cy.wrap(criarElements.first()).should('be.visible').click();
            cy.wait(2000);
          } else {
            cy.log('❌ Nenhum botão de criar agente encontrado');
          }
        });
      }
    });
    
    // Aguardar carregamento do formulário
    cy.wait(5000);

    // Estratégia avançada para preencher campo nome
    cy.log('📝 Preenchendo campo nome com simulação humana...');
    
    // Aguardar o campo estar disponível
    cy.get('input[name="name"]', { timeout: 10000 })
      .should('be.visible')
      .should('not.be.disabled');
    
    // Simular interação humana completa
    const nomeAgente = 'Agente Teste Automatizado';
    
    cy.get('input[name="name"]').then(($input) => {
      // Focar no campo primeiro
      cy.wrap($input).focus();
      cy.wait(300);
      
      // Selecionar todo o conteúdo e deletar
      cy.wrap($input)
        .type('{selectall}')
        .type('{del}')
        .should('have.value', '');
      
      // Aguardar um pouco
      cy.wait(500);
      
      // Digitar caractere por caractere com eventos
      cy.wrap($input).type(nomeAgente, { 
        delay: 150,
        force: true 
      });
      
      // Disparar todos os eventos possíveis
      cy.wrap($input)
        .trigger('input', { bubbles: true })
        .trigger('change', { bubbles: true })
        .trigger('keyup', { bubbles: true })
        .trigger('blur', { bubbles: true });
      
      // Aguardar processamento
      cy.wait(1000);
      
      // Verificar se foi preenchido
      cy.wrap($input).should('have.value', nomeAgente);
      
      // Clicar fora para garantir que perdeu o foco
      cy.get('body').click(0, 0);
      
      cy.log('✅ Campo nome preenchido com simulação humana');
    });

    // Preencher campo descrição
    cy.log('📝 Preenchendo campo descrição...');
    cy.get('textarea[name="description"]')
      .should('be.visible')
      .clear()
      .type('Descrição do Agente de Teste Automatizado', { delay: 100 })
      .trigger('input')
      .trigger('change')
      .blur();

    // Aguardar processamento
    cy.wait(1000);

    // Preencher campo de instruções
    cy.log('📝 Preenchendo campo de instruções...');
    cy.get('textarea')
      .contains('You are a helpful AI assistant.')
      .should('be.visible')
      .clear()
      .type('Relacionado a teste automatizado com cypress.', { delay: 100 })
      .trigger('input')
      .trigger('change')
      .blur();

    // Aguardar um pouco para os campos serem processados
    cy.wait(2000);

    // Rolar até o final
    cy.get('[data-radix-scroll-area-viewport]')
      .first()
      .scrollTo('bottom', { duration: 1000 });
    cy.wait(1000);

    // Validação final dos campos
    cy.log('🔍 Validação final dos campos...');
    
    // Verificar campo nome
    cy.get('input[name="name"]')
      .should('have.value', 'Agente Teste Automatizado')
      .should('not.have.class', 'border-red-500') // Não deve ter erro
      .then(($input) => {
        const valor = $input.val();
        cy.log(`Campo nome: "${valor}"`);
        expect(valor).to.not.be.empty;
      });
    
    // Verificar campo descrição
    cy.get('textarea[name="description"]')
      .should('contain.value', 'Descrição do Agente')
      .then(($textarea) => {
        const valor = $textarea.val();
        cy.log(`Campo descrição: "${valor}"`);
        expect(valor).to.not.be.empty;
      });
    
    // Verificar se ainda há mensagens de erro
    cy.get('body').then(($body) => {
      if ($body.find('*:contains("Obrigatório")').length > 0) {
        cy.log('⚠️ Ainda há campos obrigatórios - tentando abordagem alternativa');
        
        // Abordagem alternativa: usar JavaScript direto
        cy.get('input[name="name"]').then(($el) => {
          const input = $el[0];
          
          // Definir valor usando JavaScript nativo
          input.value = 'Agente Teste Automatizado';
          
          // Disparar eventos nativos
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('blur', { bubbles: true }));
          
          cy.log('✅ Valor definido via JavaScript nativo');
        });
        
        cy.wait(1000);
        
        // Verificar novamente
        cy.get('input[name="name"]').should('have.value', 'Agente Teste Automatizado');
      }
    });
    
    // Aguardar um pouco mais para garantir processamento
    cy.wait(2000);

    // Clicar em salvar
    cy.xpath('//button[div[text()[normalize-space()="Salvar"]]]')
      .scrollIntoView()
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.log('🔍 Procurando toast de sucesso...');
    cy.wait(2000);
    cy.get('.toast-description.text-gray-600')
      .contains('O agente foi criado com sucesso!')
      .should('be.visible');
    cy.log('✅ Agente criado com sucesso!');
  });
});