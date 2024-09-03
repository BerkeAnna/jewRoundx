describe('DApp Main Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');

    cy.window().then((win) => {
      // MetaMask mockolás a before hookban
      const ethereum = {
        request: ({ method }) => {
          if (method === 'eth_requestAccounts') {
            return Promise.resolve(['0x7Cc351a4CE83B21fFBDd3Cec28460F55BA1D80fe']);
          }
          return Promise.reject();
        }
      };
      win.ethereum = ethereum;
    });

    cy.reload();
  });

  it('should load the main page', () => {
    cy.get('h1').should('contain', 'Hi');
  });

  it('should click to login button', () => {
    // Várakozás arra, hogy a gomb megjelenjen
   // cy.visit('http://localhost:3000/');
    cy.get('button').should('be.visible').click();
  });
  
});
