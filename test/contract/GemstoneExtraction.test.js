const GemstoneExtraction = artifacts.require('GemstoneExtraction');

contract('GemstoneExtraction', (accounts) => {
  let contractInstance;

  // A tesztelés előtt deployoljuk a szerződést
  before(async () => {
    contractInstance = await GemstoneExtraction.deployed();
  });

  // Teszt: Új drágakő bányászása
  it('should mine a new gem', async () => {
    const result = await contractInstance.gemMining('Ruby', web3.utils.toWei('1', 'Ether'), 'Hash', false, { from: accounts[0] });
    assert(result, 'Gem mining transaction failed');

    // ell gem helyesen tárolódott
    const gem = await contractInstance.minedGems(1);
    assert.equal(gem.gemType, 'Ruby', 'Gem type is incorrect');
    assert.equal(gem.price, web3.utils.toWei('1', 'Ether'), 'Gem price is incorrect');
    assert.equal(gem.miner, accounts[0], 'Gem miner address is incorrect');
    assert.equal(gem.owner, accounts[0], 'Gem owner should initially be the miner');
  });

  // Teszt: Drágakő vásárlása
  it('should allow purchase of a gem', async () => {
    await contractInstance.purchaseGem(1, { from: accounts[1], value: web3.utils.toWei('1', 'Ether') });

    // Ellenőrizd, hogy a tulajdonos változott
    const gem = await contractInstance.minedGems(1);
    assert.equal(gem.owner, accounts[1], 'Gem owner should be accounts[1] after purchase');
    assert.equal(gem.purchased, true, 'Gem should be marked as purchased');
  });

  // Teszt: Drágakő feldolgozása
  it('should allow processing of a purchased gem', async () => {
    await contractInstance.processingGem(1, { from: accounts[1] });

    const gem = await contractInstance.minedGems(1);
    assert.equal(gem.purchased, true, 'Gem should remain purchased after processing');
  });

  // Teszt:Drágakővásárlás owner csere
  it('should allow a new owner to be marked', async () => {
    await contractInstance.markNewOwner(1, { from: accounts[2], value: web3.utils.toWei('1', 'Ether') });

    const gem = await contractInstance.minedGems(1);
    assert.equal(gem.owner, accounts[2], 'The gem owner should be accounts[2] after marking a new owner');
  });

  // Teszt: Hibakezelés, ha nincs elég pénz a vásárlásra
  it('should revert if insufficient funds are sent to mark a new owner', async () => {
    try {
      await contractInstance.markNewOwner(1, { from: accounts[3], value: web3.utils.toWei('0.5', 'Ether') });
      assert.fail('Transaction should have reverted due to insufficient funds');
    } catch (error) {
      assert(error.message.includes('Insufficient funds'), 'Expected "Insufficient funds" revert message');
    }
  });

  // Teszt: Hibakezelés, ha a drágakövet már kiválasztották
  it('should revert if the gem has already been selected', async () => {
    // Megjelöljük a gemet kiválasztottnak
    await contractInstance.markGemAsSelected(1, { from: accounts[2] });

    try {
      // Megpróbáljuk kijelölni egy új tulajdonost
      await contractInstance.markNewOwner(1, { from: accounts[3], value: web3.utils.toWei('1', 'Ether') });
      assert.fail('Transaction should have reverted because the gem is already selected');
    } catch (error) {
      assert(error.message.includes('Gem already selected'), 'Expected "Gem already selected" revert message');
    }
  });

  // Teszt: Drágakő kiválasztása
  it('should mark the gem as selected', async () => {
    // Bányászunk egy új drágakövet
    await contractInstance.gemMining('Ruby', web3.utils.toWei('2', 'Ether'), 'newHash', false, { from: accounts[0] });

    // Az új drágakő ID-ja
    const newGemId = await contractInstance.minedGemCount();

    await contractInstance.purchaseGem(newGemId, { from: accounts[1], value: web3.utils.toWei('2', 'Ether') });

    await contractInstance.markGemAsSelected(newGemId, { from: accounts[1] });

    const gem = await contractInstance.minedGems(newGemId);
    assert.equal(gem.selected, true, 'Gem should be marked as selected');
  });


  // Teszt: Tulajdonos drágaköveinek száma
  it('should return the correct gemstone count for an owner', async () => {
    const gemCount = await contractInstance.getGemstoneCountByOwner(accounts[1]);
    assert.equal(gemCount.toNumber(), 1, 'Gem count for owner accounts[1] should be 1');
  });

  // Teszt: Hibás vásárlás - kevesebb ether
  it('should revert if insufficient funds are sent for gem purchase', async () => {
    try {
      await contractInstance.purchaseGem(1, { from: accounts[2], value: web3.utils.toWei('0.5', 'Ether') });
      assert.fail('Transaction should have reverted due to insufficient funds');
    } catch (error) {
      assert(error.message.includes('revert'), 'Expected revert due to insufficient funds');
    }
  });



});
