describe('DApp testing', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');

    cy.window().then((win) => {
      // MetaMask mockolás a before hookban
      const ethereum = {
        request: ({ method, params }) => {
          if (method === 'eth_requestAccounts') {
            return Promise.resolve(['0xF1606fc7BbBcf8Ab2a96fFf3D8719fB6A49F4881']);
          }
          if (method === 'eth_sendTransaction') {
            return Promise.resolve('0xTRANSACTION_HASH'); // Szimulált tranzakció hash
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

 // context('As a miner', () => {
    
        it.skip('should complete the registration form', () => {
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
          cy.wait(8000)
          cy.get('button').should('be.visible').click();
          cy.get('input[name="password"]').should('be.visible').type('123456');
          cy.get('input[name="password"]').should('have.value', '123456');
          cy.get('button[name="dashboard"]').click();
        })

        it('Mining a new gem', () => {
          cy.wait(8000);
          cy.get('button').should('be.visible').click();
          cy.get('input[name="password"]').should('be.visible').type('123456');
          cy.get('input[name="password"]').should('have.value', '123456');
          cy.wait(5000);
          cy.get('button[name="dashboard"]').should('be.visible').click();
          cy.wait(5000);
          cy.get('button[name="gemMining"]').should('be.visible').click();
          cy.get('input[name="gemType"]').should('be.visible').type('Amethyst');
          cy.get('input[name="gemType"]').should('have.value', 'Amethyst');
          cy.get('input[name="price"]').should('be.visible').type('0.000001');
          cy.get('input[name="price"]').should('have.value', '0.000001');
          cy.get('input[name="weight"]').should('be.visible').type('500');
          cy.get('input[name="weight"]').should('have.value', '500');
          cy.get('input[name="depth"]').should('be.visible').type('7');
          cy.get('input[name="depth"]').should('have.value', '7');
          cy.get('input[name="height"]').should('be.visible').type('5');
          cy.get('input[name="height"]').should('have.value', '5');
          cy.get('input[name="width"]').should('be.visible').type('4');
          cy.get('input[name="width"]').should('have.value', '4');
          cy.get('input[name="miningLocation"]').should('be.visible').type('Artigas, Uruguay');
          cy.get('input[name="miningLocation"]').should('have.value', 'Artigas, Uruguay');
          cy.get('input[name="miningYear"]').should('be.visible').type('2019');
          cy.get('input[name="miningYear"]').should('have.value', '2019');
          cy.fixture('raw-amethyst.jpg', 'base64').then(fileContent => {
            // kép feltölts
            cy.get('input[type="file"]').attachFile({
              fileContent: fileContent,
              fileName: 'raw-amethyst.jpg',
              mimeType: 'raw-amethyst.jpg'
            });
          });
          //cy.get('button[name="addMinedGem"]').should('be.visible').click();
        
        })
        
 // })

  

  


});
