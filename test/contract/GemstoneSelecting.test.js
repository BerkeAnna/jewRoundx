const { expect } = require("chai");

describe("GemstoneSelecting Contract", function () {
    let GemstoneExtraction, gemstoneExtraction, GemstoneSelecting, gemstoneSelecting, miner, cutter, buyer;
    
    beforeEach(async function () {
        [miner, cutter, buyer] = await ethers.getSigners();
       
        GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
        gemstoneExtraction = await GemstoneExtraction.deploy();
        await gemstoneExtraction.deployed();

        GemstoneSelecting = await ethers.getContractFactory("GemstoneSelecting");
        gemstoneSelecting = await GemstoneSelecting.deploy(gemstoneExtraction.address);
        await gemstoneSelecting.deployed();
      
        const gemType = "Ruby";
        const details = "High quality red ruby";
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
    });

    it("Should select a new gem", async function () { 
        const gemId = 1;
        const gemPrice = ethers.utils.parseEther("1");
    
        // Miner purchases the gem
        await gemstoneExtraction.connect(miner).purchaseGem(gemId, { value: gemPrice });
    
        // Cutter calls markNewOwner with sufficient value for msg.value
        await gemstoneExtraction.connect(cutter).markNewOwner(gemId, { value: gemPrice });
    
        await gemstoneExtraction.connect(cutter).markGemAsSelected(gemId);
    
        const gemDetails = {
            size: "2x2x2",
            carat: ethers.BigNumber.from(2),
            gemType: "Ruby",
            color: "red"
        };
    
        await expect(
            gemstoneSelecting.connect(cutter).gemSelecting(
                gemId,
                gemDetails,
                "fileUrl",
                gemPrice
            )
        )
            .to.emit(gemstoneSelecting, "GemSelecting")
            .withArgs(
                gemId,
                gemId,
                gemDetails,
                false,           // forSale
                "fileUrl",
                gemPrice,
                false,           // used
                false,           // replaced
                cutter.address,  // owner
                cutter.address   // gemCutter
            );
        
    
        const selectedGem = await gemstoneSelecting.getSelectedGem(gemId);
        expect(selectedGem.id).to.equal(gemId);
        expect(selectedGem.minedGemId).to.equal(gemId);
        expect(selectedGem.details.size).to.equal("2x2x2");
        expect(selectedGem.details.carat).to.equal(ethers.BigNumber.from(2));
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
    

    it("Should toggle the 'forSale' status when polishGem is called", async function () {
        await gemstoneSelecting.connect(cutter).gemSelecting(
            1,
            { size: "2x2x2", carat: ethers.BigNumber.from(2), gemType: "Ruby", color: "red" },
            "fileUrl",
            ethers.utils.parseEther("1")
        );

        await gemstoneSelecting.connect(cutter).polishGem(1);

        let selectedGem = await gemstoneSelecting.getSelectedGem(1);
        expect(selectedGem.forSale).to.be.true;

        await gemstoneSelecting.connect(cutter).polishGem(1);

        selectedGem = await gemstoneSelecting.getSelectedGem(1);
        expect(selectedGem.forSale).to.be.false;
    });

    it("Should mark a gem as used when markGemAsUsed is called", async function () {
        await gemstoneSelecting.connect(cutter).gemSelecting(
            1,
            { size: "2x2x2", carat: ethers.BigNumber.from(2), gemType: "Ruby", color: "red" },
            "fileUrl",
            ethers.utils.parseEther("1")
        );
        
        await gemstoneSelecting.connect(cutter).markGemAsUsed(1);

        const selectedGem = await gemstoneSelecting.getSelectedGem(1);
        expect(selectedGem.used).to.be.true;
    });

    it("Should mark a gem as replaced when markGemAsReplaced is called", async function () {
        await gemstoneSelecting.connect(cutter).gemSelecting(
            1,
            { size: "2x2x2", carat: ethers.BigNumber.from(2), gemType: "Ruby", color: "red" },
            "fileUrl",
            ethers.utils.parseEther("1")
        );

        await gemstoneSelecting.connect(cutter).markGemAsReplaced(1);

        const selectedGem = await gemstoneSelecting.getSelectedGem(1);
        expect(selectedGem.replaced).to.be.true;
    });

    it("Should transfer ownership of a gem when transferGemOwnership is called", async function () {
        const gemPrice = ethers.utils.parseEther("1");
        await gemstoneSelecting.connect(cutter).gemSelecting(
            1,
            { size: "2x2x2", carat: ethers.BigNumber.from(2), gemType: "Ruby", color: "red" },
            "fileUrl",
            gemPrice
        );

        await gemstoneSelecting.connect(cutter).polishGem(1); // Set gem for sale

        await gemstoneSelecting.connect(buyer).transferGemOwnership(1, { value: gemPrice });

        const selectedGem = await gemstoneSelecting.getSelectedGem(1);
        expect(selectedGem.owner).to.equal(buyer.address);
        expect(selectedGem.forSale).to.be.false;
    });

    it("Should return the correct selected gems count by owner", async function () {
        await gemstoneSelecting.connect(cutter).gemSelecting(
            1,
            { size: "2x2x2", carat: ethers.BigNumber.from(2), gemType: "Ruby", color: "red" },
            "fileUrl",
            ethers.utils.parseEther("1")
        );

        const count = await gemstoneSelecting.getSelectedGemsCountByOwner(cutter.address);
        expect(count).to.equal(1);
    });
});
