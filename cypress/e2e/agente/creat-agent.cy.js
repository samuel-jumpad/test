import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Teste Creat - Criar Agente", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve criar agente com sucesso", () => {
    // Clicar em agentes
    cy.xpath('//button[span[text()="Agentes"]]')
      .should('be.visible')
      .click();

    // Meus agentes
    cy.xpath('//div[normalize-space(text())="Meus Agentes"]')
      .should('be.visible')
      .click();

    // Novo agente
    cy.wait(5000);
    cy.xpath('//div[contains(@class, "flex items-center justify-center gap-2") and .//text()="Cadastrar Novo Agente"]')
      .should('be.visible')
      .click();
    //nao tirar esse wait
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