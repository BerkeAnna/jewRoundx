describe('DApp testing', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/');
  
      cy.window().then((win) => {
        // MetaMask mockolás a before hookban
        const ethereum = {
          request: ({ method, params }) => {
            if (method === 'eth_requestAccounts') {
              return Promise.resolve(['0x7Cc351a4CE83B21fFBDd3Cec28460F55BA1D80fe']);
            }
            if (method === 'eth_sendTransaction') {
              // Mockolt tranzakció hash visszaadása
              return Promise.resolve('0xFAKE_TRANSACTION_HASH'); 
            }
            if (method === 'eth_chainId') {
                return Promise.resolve('0x5777'); // Ganache chain ID
            }
            return Promise.reject(new Error('Method not supported'));
          }
        };
        win.ethereum = ethereum;
      });
  
      cy.reload();
    });
  
    it.skip('should load the main page', () => {
      // Ellenőrizzük, hogy a főoldal betöltődött és megjelenik a címsor
      cy.get('h3').should('contain', 'ID');
    });

    it.skip('should simulate a transaction without MetaMask', () => {
        cy.get('input[placeholder="Enter Jewelry ID"]').type('1');
        cy.get('form').submit();
    
        // Ellenőrizzük, hogy helyesen történik a tranzakció
        cy.wait(5000); // Várakozás, hogy a blokklánc visszajelzést adjon

        cy.url().should('include', '/jewelry-details/1');
    });
  
    it.skip('should click the login button', () => {
        cy.wait(5000);
        // Várakozás arra, hogy a gomb megjelenjen, és utána kattintás
        cy.get('button[name="login"]').click();
    });
  
    context('As a miner', () => {
      
        it.skip('should complete the registration form', () => {
          cy.wait(5000);
          // Gomb megjelenésének és kattinthatóságának ellenőrzése
          cy.get('button[name="login"]').click();
          cy.wait(8000);
          // Email mező megkeresése és kitöltése
          cy.get('input[name="email"]').should('be.visible').type('cytest@gmail.com');
          cy.get('input[name="email"]').should('have.value', 'cytest@gmail.com');
  
          // Jelszó mező megkeresése és kitöltése
          cy.get('input[name="password"]').should('be.visible').type('123456');
          cy.get('input[name="password"]').should('have.value', '123456');
  
          cy.get('button[name="register"]').click();
          cy.wait(7000);
          cy.get('button[name="logout"]').should('be.visible').click();
  
        });

  
        beforeEach('login as miner', () => {
          cy.wait(5000);
          cy.get('button[name="login"]').click();
          cy.wait(8000);
          cy.get('input[name="password"]').should('be.visible').type('123456');
          cy.get('input[name="password"]').should('have.value', '123456');
          cy.wait(3000);
          cy.get('button[name="dashboard"]').click();
        });
          
        it.skip('my products', () => {
          cy.wait(5000);
          cy.get('button[name="myProducts"]').click();
          cy.wait(8000);
          cy.url().should('include', '/ownMinedGems');
        });

        it('mine a gem', () => {
          cy.wait(5000);
          cy.get('button[name="gemMining"]').click();
          cy.wait(8000);
          cy.url().should('include', '/addMinedGem');
          cy.get('input[name="gemType"]').should('be.visible').type('Ruby');
          cy.get('input[name="gemType"]').should('have.value', 'Ruby');
          cy.get('input[name="price"]').should('be.visible').type('1');
          cy.get('input[name="price"]').should('have.value', '1');
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
          cy.fixture('raw-ruby.webp', 'base64').then(fileContent => {
              // kép feltöltése
              cy.get('input[type="file"]').attachFile({
                fileContent: fileContent,
                fileName: 'raw-ruby.webp',
                mimeType: 'raw-ruby.webp'
              });
            });
          cy.get('button[name="addMinedGem"]').should('be.visible').click();
          cy.wait(10000);

          // Mockolt tranzakció szimulálása
          cy.window().then((win) => {
              win.ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                  {
                    from: '0x7Cc351a4CE83B21fFBDd3Cec28460F55BA1D80fe',
                    to: '0xf1AFAc02CEE168C9Bb877D173765530C52d2B996',
                    value: '0xDE0B6B3A7640000', // 1 Ether hexadecimális értéke
                    gas: '0x5208', // 21000 gas limit hexadecimális formátumban
                  }
                ],
              }).then((txHash) => {
                console.log('Transaction hash:', txHash);
                cy.wait(10000); // Várakozás a szimulált tranzakcióra
              });
          });
        });
    });
});
