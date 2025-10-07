import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Criar Pasta, Mover Conversa e Deletar Pasta", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("Deve mover mensagem para a pasta corretamente", () => {
    // Acessando chat
    cy.contains('Chat').click({ force: true });
    cy.wait(2000);

    // Criar nova pasta
    cy.xpath('//div[contains(text(), "Criar nova pasta")]')
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });

    // Digitar nome da nova pasta
    cy.wait(2000);
    cy.xpath('//input[@placeholder="Nome da nova pasta"]')
      .should('be.visible')
      .scrollIntoView()
      .type('Pasta Teste 1', { delay: 100 });

    // Clicar em criar pasta
    cy.get('body').then(($body) => {
      if ($body.find('div[role="dialog"]').length > 0) {
        cy.get('div[role="dialog"]').within(() => {
          cy.xpath('.//button[.//svg[contains(@class,"lucide-check")]]')
            .should('be.visible')
            .click({ force: true });
        });
      } else {
        if ($body.find('button svg[class*="check"]').length > 0) {
          cy.get('button svg[class*="check"]').parent()
            .should('be.visible')
            .click({ force: true });
        }
        else if ($body.find('button:contains("Criar"), button:contains("Confirmar"), button:contains("Create")').length > 0) {
          cy.get('button:contains("Criar"), button:contains("Confirmar"), button:contains("Create")').first()
            .should('be.visible')
            .click({ force: true });
        }
        else if ($body.find('button').length > 0) {
          cy.get('button').last()
            .should('be.visible')
            .click({ force: true });
        }
      }
    });

    cy.wait(300);

    // Confirmação da mensagem
    cy.get('.toast-root')
      .should('contain.text', 'Pasta criada com sucesso')
      .and('contain.text', 'Sua nova pasta está pronta para uso');

    // Clicar 3 pontinhos da pasta
    cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")')
      .should('be.visible')
      .scrollIntoView()
      .trigger('mouseover')
      .trigger('mouseenter')
      .trigger('mousemove');

    cy.wait(3000);

    // Clicar nos 3 pontinhos da pasta "Pasta Teste 1"
    cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")')
      .within(() => {
        cy.get('.folder-actions svg.lucide-ellipsis-vertical')
          .should('exist')
          .click({ force: true });
      });

    // Clicar em pasta filha
    cy.contains('div', 'Criar pasta filha', { matchCase: false })
      .should('be.visible')
      .click({ force: true });

    // Digitar nome da pasta filha
    cy.get('input[placeholder="Nome da nova pasta"]', { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type('Pasta filha teste');

    // Clicar em adicionar pasta filha
    cy.get('button:has(svg.lucide-check)', { timeout: 10000 })
      .should('be.visible')
      .should('not.be.disabled')
      .click({ force: true });

    cy.wait(3000);

    // Confirmação da pasta filha
    cy.get('.toast-root')
      .should('contain.text', 'Pasta criada com sucesso')
      .and('contain.text', 'Sua nova pasta está pronta para uso');

    // Clicando em "Geral"
    cy.contains('div', 'Geral').scrollIntoView().click({ force: true });
    cy.wait(1500);

    // Clicando na primeira mensagem e arrastando para "Pasta Teste 1"
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
      });     
    });

    // Acessando "Pasta Teste 1"
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
        });
      });
    });

    // Deletar "Pasta filha teste"
    cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta filha teste")')
      .should('be.visible')
      .scrollIntoView()
      .trigger('mouseover')
      .trigger('mouseenter')
      .trigger('mousemove');

    cy.wait(3000);

    // Clicar nos 3 pontinhos da pasta filha
    cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta filha teste")')
      .within(() => {
        cy.get('.folder-actions svg.lucide-ellipsis-vertical')
          .should('exist')
          .click({ force: true });
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

    // Clicar 3 pontinhos da pasta principal
    cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")')
      .should('be.visible')
      .scrollIntoView()
      .trigger('mouseover')
      .trigger('mouseenter')
      .trigger('mousemove');

    cy.wait(3000);

    // Clicar nos 3 pontinhos da pasta "Pasta Teste 1"
    cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("Pasta Teste 1")')
      .within(() => {
        cy.get('.folder-actions svg.lucide-ellipsis-vertical')
          .should('exist')
          .click({ force: true });
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
  });
});