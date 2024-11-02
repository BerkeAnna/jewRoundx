const { expect } = require("chai");

describe.only("Jewelry Contract", function () {
    let Jewelry, jewelry, GemstoneSelecting, gemstoneSelecting, GemstoneExtraction, gemstoneExtraction;
    let owner, jeweler, buyer, cutter;

    before(async function () {
        [owner, jeweler, buyer, cutter] = await ethers.getSigners();
    
        GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
        gemstoneExtraction = await GemstoneExtraction.deploy();
        await gemstoneExtraction.deployed();
    
        GemstoneSelecting = await ethers.getContractFactory("GemstoneSelecting");
        gemstoneSelecting = await GemstoneSelecting.deploy(gemstoneExtraction.address);
        await gemstoneSelecting.deployed();
    
        Jewelry = await ethers.getContractFactory("Jewelry");
        jewelry = await Jewelry.deploy(gemstoneSelecting.address);
        await jewelry.deployed();
    
        // Mine the initial gem here to set up for tests
        const gemType = "Ruby";
        const details = "red ruby";
        const price = ethers.utils.parseEther("1");
        const miningLocation = "Africa";
        const miningYear = 2024;
        const fileURL = "https://example.com/gem.jpg";
        const purchased = false;
    
        await gemstoneExtraction.gemMining(
            gemType,
            details,
            price,
            miningLocation,
            miningYear,
            fileURL,
            purchased
        );
    
        const minedGem = await gemstoneExtraction.minedGems(1); // assuming gem ID 1 is created
        console.log("Mined Gem ID:", minedGem.id);
    });
    

    it("Should create a new jewelry item", async function () {
        const gemId = 2;
        const name = "Ruby Ring";
        const physicalDetails = "sampleMetadataHash";
        const price = ethers.utils.parseEther("1");
        const fileURL = "https://example.com/jewelry1";

        await jewelry.connect(owner).jewelryMaking(name, gemId, physicalDetails, false, price, fileURL);

        const jewelryDetails = await jewelry.getJewelryDetails(1);
        expect(jewelryDetails.name).to.equal(name);
        expect(jewelryDetails.physicalDetails).to.equal(physicalDetails);
        expect(jewelryDetails.price).to.equal(price);
        expect(jewelryDetails.owner).to.equal(owner.address);
        expect(jewelryDetails.jewOwner).to.equal(owner.address);
    });

    it("Should allow the purchase of a jewelry item", async function () {
        const jewelryId = 1;
        const price = ethers.utils.parseEther("1");

        // Explicitly set the jewelry item for sale
        await jewelry.connect(owner).markedAsSale(jewelryId);

        // Ensure the jewelry item is now marked for sale
        const jewelryDetailsBeforePurchase = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetailsBeforePurchase.sale).to.equal(true);

        // Proceed with purchase
        await jewelry.connect(buyer).buyJewelry(jewelryId, { value: price });

        const jewelryDetailsAfterPurchase = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetailsAfterPurchase.owner).to.equal(buyer.address);
        expect(jewelryDetailsAfterPurchase.jewOwner).to.equal(buyer.address);
    });

    it("Should replace a gem in the jewelry item", async function () {
        const jewelryId = 1;
        const oldGemId = 1;
        const newGemId = 2;

        // Ensure new gem is created in `selectedGems`
        const gemDetails = { size: "2x2x2", carat: 2, gemType: "Emerald", color: "Green" };
        const price = ethers.utils.parseEther("1");
        const fileURL = "https://example.com/gem2.jpg";

        await gemstoneSelecting.connect(owner).gemSelecting(newGemId, gemDetails, fileURL, price);

        await jewelry.connect(owner).replaceGem(jewelryId, oldGemId, newGemId);

        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.previousGemIds.map(id => id.toNumber())).to.include(newGemId);
    });

    it("Should add a gem in the jewelry item", async function () {
        const jewelryId = 1;
        const gemId = 2;
        const gemType = "Ruby";
        const details = "red ruby";
        const price = ethers.utils.parseEther("1");
        const miningLocation = "Africa";
        const miningYear = 2024;
        const fileURL = "https://example.com/gem.jpg";
        const purchased = false;
        const gemPrice = ethers.utils.parseEther("1");
    
        // Mine the gem
        await gemstoneExtraction.gemMining(
            gemType,
            details,
            price,
            miningLocation,
            miningYear,
            fileURL,
            purchased
        );
    
        // Purchase the gem by the initial owner
        await gemstoneExtraction.connect(owner).purchaseGem(gemId, { value: gemPrice });
    
        // Transfer ownership of the gem to cutter
        await gemstoneExtraction.connect(owner).markNewOwner(gemId, { value: gemPrice });
    
        const gemDetails = {
            size: "2x2x2",
            carat: ethers.BigNumber.from(2),
            gemType: "Ruby",
            color: "red"
        };
    
        // Select and polish the gem
        await gemstoneSelecting.connect(cutter).gemSelecting(gemId, gemDetails, "fileUrl", gemPrice);
        await gemstoneSelecting.connect(cutter).polishGem(gemId);
    
        // Ellenőrzés a tulajdonosváltás előtt
        const selectedGemBefore = await gemstoneSelecting.getSelectedGem(gemId);
            // Transfer gem ownership to jeweler only if jeweler is not already the owner
        await gemstoneSelecting.connect(buyer).transferGemOwnership(gemId, { value: gemPrice });
        
    
        const selectedGemAfter = await gemstoneSelecting.getSelectedGem(gemId);
        
    
    
        // Now jeweler should be able to update the gem in the jewelry
        await expect(jewelry.connect(buyer).updateGem(jewelryId, gemId))
            .to.emit(jewelry, "GemUpdated")
            .withArgs(jewelryId, gemId);
    
        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.previousGemIds.map(id => id.toNumber())).to.include(gemId);
    });
    

    it("Should mark the jewelry as finished", async function () {
        const jewelryId = 1;

        await jewelry.connect(owner).markedAsFinished(jewelryId);

        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.processing).to.equal(false);
    });

    it("Should toggle jewelry sale state", async function () {
        const jewelryId = 1;

        await jewelry.connect(owner).markedAsSale(jewelryId);

        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.sale).to.equal(true);
    });

    it("Should add jewelry for repair", async function () {
        const jewelryId = 1;

        await jewelry.connect(owner).addForRepair(jewelryId);

        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.owner).to.equal(jewelryDetails.jeweler);
    });

    it("Should return jewelry to the original owner", async function () {
        const jewelryId = 1;

        await jewelry.connect(owner).returnToJewOwner(jewelryId);

        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.owner).to.equal(jewelryDetails.jewOwner);
    });

    it("Should return the correct jewelry count for an owner", async function () {
        const jewelryId = 1;
        const price = ethers.utils.parseEther("1");

        await jewelry.connect(owner).markedAsSale(jewelryId);
        await jewelry.connect(buyer).buyJewelry(jewelryId, { value: price });

        const jewelryCount = await jewelry.getJewelryCountByOwner(buyer.address);
        expect(jewelryCount).to.equal(1);
    });

    it("Should return the correct jewelry count for a jeweler", async function () {
        const jewelryCount = await jewelry.getJewelryCountByJeweler(owner.address);
        expect(jewelryCount).to.equal(1);
    });

    // Negative Test: Insufficient funds
    it("Should fail to buy jewelry if insufficient funds are sent", async function () {
        const jewelryId = 1;
        const insufficientFunds = ethers.utils.parseEther("0.5");

        // Ensure jewelry item is for sale
        await jewelry.connect(owner).markedAsSale(jewelryId);

        await expect(
            jewelry.connect(buyer).buyJewelry(jewelryId, { value: insufficientFunds })
        ).to.be.revertedWith("Insufficient funds");
    });

});
