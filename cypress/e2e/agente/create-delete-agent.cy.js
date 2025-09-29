import LoginPage from "../../support/pages/login/login.page.js";
import AgentPage from "../../support/pages/agent/agent.page.js";

describe("Agents - Create and Delete Agent", () => {
  let agentName = '';

  beforeEach(() => {
    cy.setupTest();
  });

  it("should create and delete agent successfully", () => {
    const count = Cypress.env('agentCounter') || 1;
    Cypress.env('agentCounter', count + 1);
    
    const adjectives = ['Fast', 'Smart', 'Brilliant', 'Agile', 'Wise'];
    const nouns = ['Lion', 'Falcon', 'Wolf', 'Tiger', 'Eagle'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    agentName = `${count} - Agent ${randomAdj} ${randomNoun}`;

    AgentPage
      .createNewAgent(agentName)
      .deleteAgent(agentName);
  });
});


