const GemstoneSelecting = artifacts.require('GemstoneSelecting');
const GemstoneExtraction = artifacts.require('GemstoneExtraction');

contract('GemstoneSelecting', (accounts) => {
  let contractInstance;
  let gemstoneExtractionInstance;

  // A tesztelés előtt deployoljuk a szerződést
  before(async () => {
    // Először telepítjük a GemstoneExtraction szerződést
    gemstoneExtractionInstance = await GemstoneExtraction.new();
    // Ezután telepítjük a GemstoneSelecting szerződést a GemstoneExtraction címével
    contractInstance = await GemstoneSelecting.new(gemstoneExtractionInstance.address);
  });

  // Teszt: Új drágakő kiválasztása
  it('should select a new gem', async () => {
    const minedGemId = 1;
    const metadataHash = "Hash";
    const price = web3.utils.toWei('1', 'Ether');

    // Kiválasztjuk a drágakövet
    await contractInstance.gemSelecting(minedGemId, metadataHash, price, { from: accounts[0] });

    // Ellenőrizd, hogy a drágakő bejegyzés helyesen tárolódott
    const gem = await contractInstance.getSelectedGem(minedGemId);
    assert.equal(gem.minedGemId, minedGemId, 'Gem minedGemId is incorrect');
    assert.equal(gem.metadataHash, metadataHash, 'Gem metadataHash is incorrect');
    assert.equal(gem.price, price, 'Gem price is incorrect');
    assert.equal(gem.owner, accounts[0], 'Gem owner should initially be accounts[0]');
  });

  // Teszt: Drágakő polírozása (forSale állapot váltása)
  it('should toggle gem polish state (forSale)', async () => {
    const gemId = 1;
    await contractInstance.polishGem(gemId, { from: accounts[0] });

    const gem = await contractInstance.getSelectedGem(gemId);
    assert.equal(gem.forSale, true, 'Gem should be marked for sale after polishing');
  });


  // Teszt: Drágakő átruházása
  it('should allow gem ownership transfer', async () => {
    const gemId = 1;
    const price = web3.utils.toWei('1', 'Ether');

    await contractInstance.transferGemOwnership(gemId, { from: accounts[1], value: price });

    const gem = await contractInstance.getSelectedGem(gemId);
    assert.equal(gem.owner, accounts[1], 'Gem owner should now be accounts[1]');
  });

  // Teszt: Drágakő használata
  it('should mark gem as used', async () => {
    const gemId = 1;

    await contractInstance.markGemAsUsed(gemId, { from: accounts[1] });

    const gem = await contractInstance.getSelectedGem(gemId);
    assert.equal(gem.used, true, 'Gem should be marked as used');
  });

  // Teszt: Előző drágakő tárolása
  it('should set the previous gem ID', async () => {
    const gemId = 1;
    const prevGemId = 0;

    // Beállítjuk az előző drágakövet
    await contractInstance.setPreviousGemId(gemId, prevGemId, { from: accounts[0] });

    // Ellenőrizzük, hogy az prev gem ID helyesen lett beállítva
    const gem = await contractInstance.getSelectedGem(gemId);
    assert.equal(gem.previousGemId, prevGemId, 'Previous gem ID should be set');
  });

  // Teszt: Tulajdonoshoz tartozó drágakövek száma
  it('should return the correct gemstone count for an owner', async () => {
    const gemCount = await contractInstance.getSelectedGemsCountByOwner(accounts[1]);
    assert.equal(gemCount.toNumber(), 1, 'Gem count for owner accounts[1] should be 1');
  });
});
