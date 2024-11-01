const { expect } = require("chai");

describe("GemstoneExtraction Contract", function () {
    let GemstoneExtraction, gemstoneExtraction, owner;
    
    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
        gemstoneExtraction = await GemstoneExtraction.deploy();
        await gemstoneExtraction.deployed();
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
                1, // ID az első gemhez
                gemType,
                details,
                price,
                miningLocation,
                miningYear,
                false, // selected kezdeti értéke
                owner.address, // miner cím
                owner.address, // owner cím
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
        expect(minedGem.miner).to.equal(owner.address);
        expect(minedGem.owner).to.equal(owner.address);
        expect(minedGem.fileURL).to.equal(fileURL);
        expect(minedGem.purchased).to.equal(purchased);
    });
});
