const Jewelry = artifacts.require('Jewelry');
const GemstoneSelecting = artifacts.require('GemstoneSelecting');
const GemstoneExtraction = artifacts.require('GemstoneExtraction');

contract('Jewelry', (accounts) => {
    let jewelryInstance;
    let gemstoneSelectingInstance;
    let gemstoneExtractionInstance;

    // A tesztelés előtt deployoljuk a szerződést
    before(async () => {
        //  telepítjük a GemstoneExtraction szerződést
        gemstoneExtractionInstance = await GemstoneExtraction.new();

        //  telepítjük a GemstoneSelecting szerződést a GemstoneExtraction címével
        gemstoneSelectingInstance = await GemstoneSelecting.new(gemstoneExtractionInstance.address);

        //  telepítjük a Jewelry szerződést a GemstoneSelecting szerződés címével
        jewelryInstance = await Jewelry.new(gemstoneSelectingInstance.address);

        const minedGemId = 1;
        const metadataHash = "sampleMetadataHash";
        const price = web3.utils.toWei('1', 'Ether');
        await gemstoneSelectingInstance.gemSelecting(minedGemId, metadataHash, price, { from: accounts[0] });

        const newGemId = 2;
        await gemstoneSelectingInstance.gemSelecting(newGemId, metadataHash, price, { from: accounts[0] });

    });


    // Teszt: Új ékszer készítése
    it('should create a new jewelry item', async () => {
        const gemId = 1;  // Feltételezve, hogy van egy drágakő a GemstoneSelecting szerződésben
        const name = "Ruby Ring";
        const metadataHash = "sampleMetadataHash";
        const price = web3.utils.toWei('1', 'Ether');
        const fileURL = "https://example.com/jewelry1";

        // Ékszer készítése
        await jewelryInstance.jewelryMaking(name, gemId, metadataHash, true, price, fileURL, { from: accounts[0] });

        // Ellenőrizzük, hogy az ékszer helyesen tárolódott
        const jewelry = await jewelryInstance.getJewelryDetails(1);
        assert.equal(jewelry.name, name, 'Jewelry name is incorrect');
        assert.equal(jewelry.metadataHash, metadataHash, 'Metadata hash is incorrect');
        assert.equal(jewelry.price, price, 'Price is incorrect');
        assert.equal(jewelry.owner, accounts[0], 'Jewelry owner should be accounts[0]');
        assert.equal(jewelry.jewOwner, accounts[0], 'Jewelry jewOwner should be accounts[0]');
    });

    // Teszt: Ékszer megvásárlása
    it('should allow the purchase of a jewelry item', async () => {
        const jewelryId = 1;
        const price = web3.utils.toWei('1', 'Ether');

        await jewelryInstance.buyJewelry(jewelryId, { from: accounts[1], value: price });

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        assert.equal(jewelry.owner, accounts[1], 'Jewelry owner should be accounts[1]');
        assert.equal(jewelry.jewOwner, accounts[1], 'Jewelry jewOwner should be accounts[1]');
    });

    // Teszt: Drágakő cseréje ékszeren belül
    it('should replace a gem in the jewelry item', async () => {
        const jewelryId = 1;
        const oldGemId = 1;
        const newGemId = 2;

        // Drágakő cseréje
        await jewelryInstance.replaceGem(jewelryId, oldGemId, newGemId, { from: accounts[0] });

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        assert.include(jewelry.previousGemIds.map(id => id.toNumber()), newGemId, 'New gem ID should be in previousGemIds');
    });

    // Teszt: Ékszer befejezése
    it('should mark the jewelry as finished', async () => {
        const jewelryId = 1;

        await jewelryInstance.markedAsFinished(jewelryId, { from: accounts[0] });

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        assert.equal(jewelry.processing, false, 'Jewelry processing should be marked as finished');
    });

    // Teszt: Ékszer eladása
    it('should toggle jewelry sale state', async () => {
        const jewelryId = 1;

        await jewelryInstance.markedAsSale(jewelryId, { from: accounts[0] });

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        assert.equal(jewelry.sale, true, 'Jewelry should be marked for sale');
    });

    // Teszt: Ékszer javításra küldése
    it('should add jewelry for repair', async () => {
        const jewelryId = 1;

        await jewelryInstance.addForRepair(jewelryId, { from: accounts[0] });

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        assert.equal(jewelry.owner, jewelry.jeweler, 'Jewelry should be with the jeweler for repair');
    });

    // Teszt: Ékszer visszaküldése a tulajdonosnak
    it('should return jewelry to the original owner', async () => {
        const jewelryId = 1;

        await jewelryInstance.returnToJewOwner(jewelryId, { from: accounts[0] });

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        assert.equal(jewelry.owner, jewelry.jewOwner, 'Jewelry should be returned to the original owner');
    });

    // Teszt: Tulajdonoshoz tartozó ékszerek száma
    it('should return the correct jewelry count for an owner', async () => {
        const jewelryCount = await jewelryInstance.getJewelryCountByOwner(accounts[1]);
        assert.equal(jewelryCount.toNumber(), 1, 'Jewelry count for owner accounts[1] should be 1');
    });

    // Teszt: Ékszerészhez tartozó ékszerek száma
    it('should return the correct jewelry count for a jeweler', async () => {
        const jewelryCount = await jewelryInstance.getJewelryCountByJeweler(accounts[0]);
        assert.equal(jewelryCount.toNumber(), 1, 'Jewelry count for jeweler accounts[0] should be 1');
    });
});
