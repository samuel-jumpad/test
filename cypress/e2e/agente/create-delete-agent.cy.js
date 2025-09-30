import LoginPage from "../../support/pages/login/login.page.js";
import AgentPage from "../../support/pages/agent/agent.page.js";

describe("Agents - Create and Delete Agent", () => {
  let agentName = '';

  beforeEach(() => {
    cy.log('🔍 Iniciando setup do teste create-delete-agent...');
    cy.setupTest();
    cy.log('✅ Setup concluído, iniciando teste...');
  });

  it("should create and delete agent successfully", () => {
    // Generate unique agent name
    const count = Cypress.env('agentCounter') || 1;
    Cypress.env('agentCounter', count + 1);
    
    const adjectives = ['Fast', 'Smart', 'Brilliant', 'Agile', 'Wise'];
    const nouns = ['Lion', 'Falcon', 'Wolf', 'Tiger', 'Eagle'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    agentName = `${count} - Agent ${randomAdj} ${randomNoun}`;

    cy.log(`🤖 Testando criação e exclusão do agente: ${agentName}`);

    // Step 1: Create Agent
    cy.log('📝 Passo 1: Criando novo agente...');
    AgentPage.createNewAgent(agentName);
    cy.log('✅ Agente criado com sucesso');

    // Wait a bit before deletion
    cy.wait(3000);

    // Step 2: Delete Agent
    cy.log('🗑️ Passo 2: Excluindo agente...');
    AgentPage.deleteAgent(agentName);
    cy.log('✅ Agente excluído com sucesso');

    cy.log(`🎉 Teste concluído com sucesso para o agente: ${agentName}`);
  });
});


