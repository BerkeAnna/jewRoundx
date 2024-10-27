/*const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Jewelry", function () {
    let jewelryInstance, gemstoneSelectingInstance, gemstoneExtractionInstance;
    let owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        // Deployáljuk a GemstoneExtraction szerződést
        const GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
        gemstoneExtractionInstance = await GemstoneExtraction.deploy();
        await gemstoneExtractionInstance.deployed();

        // Deployáljuk a GemstoneSelecting szerződést a GemstoneExtraction címével
        const GemstoneSelecting = await ethers.getContractFactory("GemstoneSelecting");
        gemstoneSelectingInstance = await GemstoneSelecting.deploy(gemstoneExtractionInstance.address);
        await gemstoneSelectingInstance.deployed();

        // Deployáljuk a Jewelry szerződést a GemstoneSelecting szerződés címével
        const Jewelry = await ethers.getContractFactory("Jewelry");
        jewelryInstance = await Jewelry.deploy(gemstoneSelectingInstance.address);
        await jewelryInstance.deployed();

        // Két drágakő kiválasztása a tesztekhez
        const metadataHash = "sampleMetadataHash";
        const price = ethers.utils.parseEther("1");
        await gemstoneSelectingInstance.connect(owner).gemSelecting(1, metadataHash, price);
        await gemstoneSelectingInstance.connect(owner).gemSelecting(2, metadataHash, price);
    });

    it("should create a new jewelry item", async function () {
        const gemId = 1;
        const name = "Ruby Ring";
        const metadataHash = "sampleMetadataHash";
        const price = ethers.utils.parseEther("1");
        const fileURL = "https://example.com/jewelry1";

        await jewelryInstance.connect(owner).jewelryMaking(name, gemId, metadataHash, true, price, fileURL);

        const jewelry = await jewelryInstance.getJewelryDetails(1);
        expect(jewelry.name).to.equal(name);
        expect(jewelry.metadataHash).to.equal(metadataHash);
        expect(jewelry.price).to.equal(price);
        expect(jewelry.owner).to.equal(owner.address);
        expect(jewelry.jewOwner).to.equal(owner.address);
    });

    it("should allow the purchase of a jewelry item", async function () {
        const jewelryId = 1;
        const price = ethers.utils.parseEther("1");

        await jewelryInstance.connect(addr1).buyJewelry(jewelryId, { value: price });

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        expect(jewelry.owner).to.equal(addr1.address);
        expect(jewelry.jewOwner).to.equal(addr1.address);
    });

    it("should replace a gem in the jewelry item", async function () {
        const jewelryId = 1;
        const oldGemId = 1;
        const newGemId = 2;

        await jewelryInstance.connect(owner).replaceGem(jewelryId, oldGemId, newGemId);

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        expect(jewelry.previousGemIds.map(id => id.toNumber())).to.include(newGemId);
    });

    it("should mark the jewelry as finished", async function () {
        const jewelryId = 1;

        await jewelryInstance.connect(owner).markedAsFinished(jewelryId);

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        expect(jewelry.processing).to.equal(false);
    });

    it("should toggle jewelry sale state", async function () {
        const jewelryId = 1;

        await jewelryInstance.connect(owner).markedAsSale(jewelryId);

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        expect(jewelry.sale).to.equal(true);
    });

    it("should add jewelry for repair", async function () {
        const jewelryId = 1;

        await jewelryInstance.connect(owner).addForRepair(jewelryId);

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        expect(jewelry.owner).to.equal(jewelry.jeweler);
    });

    it("should return jewelry to the original owner", async function () {
        const jewelryId = 1;

        await jewelryInstance.connect(owner).returnToJewOwner(jewelryId);

        const jewelry = await jewelryInstance.getJewelryDetails(jewelryId);
        expect(jewelry.owner).to.equal(jewelry.jewOwner);
    });

    it("should return the correct jewelry count for an owner", async function () {
        const jewelryCount = await jewelryInstance.getJewelryCountByOwner(addr1.address);
        expect(jewelryCount.toNumber()).to.equal(1);
    });

    it("should return the correct jewelry count for a jeweler", async function () {
        const jewelryCount = await jewelryInstance.getJewelryCountByJeweler(owner.address);
        expect(jewelryCount.toNumber()).to.equal(1);
    });
});
*/