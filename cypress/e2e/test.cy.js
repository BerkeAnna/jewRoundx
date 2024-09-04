describe('DApp testing', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');

    cy.window().then((win) => {
      // MetaMask mockolás a before hookban
      const ethereum = {
        request: ({ method }) => {
          if (method === 'eth_requestAccounts') {
            return Promise.resolve(['0x7Cc351a4CE83B21fFBDd3Cec28460F55BA1D80fe']);
          }
          return Promise.reject(new Error('Method not supported'));
        }
      };
      win.ethereum = ethereum;
    });

    cy.reload();
  });

  it('should load the main page', () => {
    // Ellenőrizzük, hogy a főoldal betöltődött és megjelenik a címsor
    cy.get('h1').should('contain', 'Hi');
  });

  it('should click the login button', () => {
    // Várakozás arra, hogy a gomb megjelenjen, és utána kattintás
    cy.get('button').should('be.visible').click();
  });

  context('As a miner', () => {
    
        it('should complete the registration form', () => {
          // Gomb megjelenésének és kattinthatóságának ellenőrzése
          cy.get('button').should('be.visible').click();
          cy.wait(1000);

          // Email mező megkeresése és kitöltése
          cy.get('input[name="email"]').should('be.visible').type('cytest2@gmail.com');
          cy.get('input[name="email"]').should('have.value', 'cytest2@gmail.com');

          // Jelszó mező megkeresése és kitöltése
          cy.get('input[name="password"]').should('be.visible').type('123456');
          cy.get('input[name="password"]').should('have.value', '123456');

          cy.get('button[name="register"]').click();
          cy.wait(7000);
          //cy.get('button[name="logout"]').should('be.visible').click();

        });

        it('login as miner', () => {
          cy.get('button').should('be.visible').click();
          cy.get('input[name="password"]').should('be.visible').type('123456');
          cy.get('input[name="password"]').should('have.value', '123456');
          cy.get('button[name="dashboard"]').click();
        })
        
  })


});
