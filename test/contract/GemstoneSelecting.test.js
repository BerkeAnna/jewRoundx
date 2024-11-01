const { expect } = require("chai");

describe("GemstoneSelecting Contract", function () {
    let GemstoneExtraction, gemstoneExtraction, GemstoneSelecting, gemstoneSelecting, miner, cutter;
    
    beforeEach(async function () {
        [miner, cutter] = await ethers.getSigners();
       
        GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
        gemstoneExtraction = await GemstoneExtraction.deploy();
        await gemstoneExtraction.deployed();

        // GemstoneSelecting deployálása a GemstoneExtraction címével
        GemstoneSelecting = await ethers.getContractFactory("GemstoneSelecting");
        gemstoneSelecting = await GemstoneSelecting.deploy(gemstoneExtraction.address);
        await gemstoneSelecting.deployed();
      
        // Mined Gem létrehozása
        const gemType = "Ruby";
        const details = "High quality red ruby";
        const price = ethers.utils.parseEther("1"); // ár Etherben
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
    });

    it("Should select a new gem", async function () { 
        const gemId = 1; // első gem ID-je
        const gemPrice = ethers.utils.parseEther("1");

        await gemstoneExtraction.connect(miner).purchaseGem(gemId, { value: 1 });
        gemstoneExtraction.connect(cutter).markNewOwner(gemId, { value: gemPrice })
        gemstoneExtraction.connect(cutter).markGemAsSelected(gemId, { value: gemPrice })

        const gemDetails = {
            size: "2x2x2",
            carat: ethers.BigNumber.from(2),
            gemType: "Ruby",
            color: "red"
        };

        await expect(
            gemstoneSelecting.connect(cutter).gemSelecting(
                1,
                gemDetails,
                "fileUrl",
                gemPrice
            )
        )
            .to.emit(gemstoneSelecting, "GemSelecting")
            .withArgs(
                1,
                1,
                gemDetails,
                false,
                "fileUrl",
                gemPrice,
                false,
                false,
                cutter.address,
                cutter.address,

            )        
        const selectedGem = await gemstoneSelecting.getSelectedGem(1);
        expect(selectedGem.id).to.equal(1);
        expect(selectedGem.minedGemId).to.equal(1);
        expect(selectedGem.details.size).to.equal("2x2x2");
        expect(selectedGem.details.carat).to.equal( ethers.BigNumber.from(2));
        expect(selectedGem.details.gemType).to.equal("Ruby");
        expect(selectedGem.details.color).to.equal("red");
        expect(selectedGem.forSale).to.equal(false);
        expect(selectedGem.fileURL).to.equal("fileUrl");
        expect(selectedGem.price).to.equal(gemPrice);
        expect(selectedGem.used).to.equal(false);
        expect(selectedGem.replaced).to.equal(false);
        expect(selectedGem.owner).to.equal(cutter.address);
        expect(selectedGem.gemCutter).to.equal(cutter.address);

    });
});