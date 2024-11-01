const { expect } = require("chai");

describe("GemstoneExtraction Contract", function () {
    let GemstoneExtraction, gemstoneExtraction, miner;
    
    beforeEach(async function () {
        [miner, cutter] = await ethers.getSigners();
        GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
        gemstoneExtraction = await GemstoneExtraction.deploy();
        await gemstoneExtraction.deployed();

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

    it("should mine a gem and emit GemMining event", async function () {
        const gemType = "Ruby";
        const details = "High quality red ruby";
        const price = ethers.utils.parseEther("1"); // ár Etherben
        const miningLocation = "Africa";
        const miningYear = 2024;
        const fileURL = "https://example.com/gem.jpg";
        const purchased = false;

        await expect(
            gemstoneExtraction.gemMining(
                gemType,
                details,
                price,
                miningLocation,
                miningYear,
                fileURL,
                purchased
            )
        )
            .to.emit(gemstoneExtraction, "GemMining")
            .withArgs(
                2, // ID az első gemhez
                gemType,
                details,
                price,
                miningLocation,
                miningYear,
                false, // selected kezdeti értéke
                miner.address, // miner cím
                miner.address, // miner cím
                fileURL,
                purchased
            );

        const minedGem = await gemstoneExtraction.minedGems(1);
        expect(minedGem.gemType).to.equal(gemType);
        expect(minedGem.details).to.equal(details);
        expect(minedGem.price).to.equal(price);
        expect(minedGem.miningLocation).to.equal(miningLocation);
        expect(minedGem.miningYear).to.equal(miningYear);
        expect(minedGem.selected).to.be.false;
        expect(minedGem.miner).to.equal(miner.address);
        expect(minedGem.owner).to.equal(miner.address);
        expect(minedGem.fileURL).to.equal(fileURL);
        expect(minedGem.purchased).to.equal(purchased);
    });

   

    it("should allow purchase of a gem and emit GemPurchased event", async function () {
        const gemId = 1; // első gem ID-je
        const gemPrice = ethers.utils.parseEther("1");

        await expect(
            gemstoneExtraction.connect(miner).purchaseGem(gemId, { value: gemPrice })
        )
            .to.emit(gemstoneExtraction, "GemPurchased")
            .withArgs(
                gemId,
                "Ruby",
                "High quality red ruby",
                gemPrice,
                "Africa",
                2024,
                false, 
                miner.address, 
                miner.address, 
                "https://example.com/gem.jpg",
                true 
            );

        const minedGem = await gemstoneExtraction.minedGems(gemId);
        expect(minedGem.miner).to.equal(miner.address);
        expect(minedGem.purchased).to.be.true;
    });

    it("should allow a new owner to be marked and emit MarkNewOwner event", async function () {
        const gemId = 1; // első gem ID-je
        const gemPrice = ethers.utils.parseEther("1");
        await gemstoneExtraction.connect(miner).purchaseGem(gemId, { value: 1 });
        const minerBalance = await miner.getBalance();

        // Új tulajdonos beállítása a `markNewOwner` függvénnyel
        await expect(
            gemstoneExtraction.connect(cutter).markNewOwner(gemId, { value: gemPrice })
        )
            .to.emit(gemstoneExtraction, "MarkNewOwner")
            .withArgs(
                gemId,
                "Ruby",
                "High quality red ruby",
                gemPrice,
                "Africa",
                2024,
                false, // selected értéke
                miner.address, // miner cím
                cutter.address, // új tulajdonos (cutter) cím
                "https://example.com/gem.jpg",
                true // purchased értéke
            );

        // ell, hogy az `owner` mező megváltozott
        const minedGem = await gemstoneExtraction.minedGems(gemId);
        expect(minedGem.owner).to.equal(cutter.address);

        // ell, hogy az Ether át lett utalva, figyelembe véve a gázköltségeket
        const finalBalance = await miner.getBalance();

        console.log("minerBalance", minerBalance)
        console.log("finalBalance", finalBalance)
        expect(finalBalance.sub(minerBalance)).to.be.closeTo(gemPrice, ethers.utils.parseEther("0.001"));
    });

    it("should allow mark the gem as selected and emit MarkGemAsSelected event", async function () {
        const gemId = 1; // első gem ID-je
        const gemPrice = ethers.utils.parseEther("1");
        await gemstoneExtraction.connect(miner).purchaseGem(gemId, { value: 1 });
        gemstoneExtraction.connect(cutter).markNewOwner(gemId, { value: gemPrice })

        await expect(
            gemstoneExtraction.connect(cutter).markGemAsSelected(gemId, { value: gemPrice })
        )
            .to.emit(gemstoneExtraction, "MarkGemAsSelected")
            .withArgs(
                gemId,
                "Ruby",
                "High quality red ruby",
                gemPrice,
                "Africa",
                2024,
                true, // selected értéke
                miner.address, // miner cím
                cutter.address, // új tulajdonos (cutter) cím
                "https://example.com/gem.jpg",
                true // purchased értéke
            );

        const minedGem = await gemstoneExtraction.minedGems(gemId);
        expect(minedGem.selected).to.be.true;
        expect(minedGem.owner).to.equal(cutter.address);
    });
});
