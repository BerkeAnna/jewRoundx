const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GemstoneExtraction", function () {
  let gemstoneExtraction, owner, addr1, addr2, addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
    gemstoneExtraction = await GemstoneExtraction.deploy();
    await gemstoneExtraction.deployed();
  });

  it("should mine a new gem", async function () {
    const tx = await gemstoneExtraction.connect(owner).gemMining(
      "Ruby", 
      ethers.utils.parseEther("1"), 
      "Hash", 
      false,
      "https://example.com/gem.jpg"
    );
    await tx.wait();

    const gem = await gemstoneExtraction.minedGems(1);
    expect(gem.gemType).to.equal("Ruby");
    expect(gem.price).to.equal(ethers.utils.parseEther("1"));
    expect(gem.miner).to.equal(owner.address);
    expect(gem.owner).to.equal(owner.address);
  });

  it("should allow purchase of a gem", async function () {
    await gemstoneExtraction.connect(owner).gemMining("Ruby", ethers.utils.parseEther("1"), "Hash", false, "https://example.com/gem.jpg");
    await gemstoneExtraction.connect(addr1).purchaseGem(1, { value: ethers.utils.parseEther("1") });

    const gem = await gemstoneExtraction.minedGems(1);
    expect(gem.owner).to.equal(addr1.address);
    expect(gem.purchased).to.equal(true);
  });

  it("should allow processing of a purchased gem", async function () {
    await gemstoneExtraction.connect(owner).gemMining("Ruby", ethers.utils.parseEther("1"), "Hash", false, "https://example.com/gem.jpg");
    await gemstoneExtraction.connect(addr1).purchaseGem(1, { value: ethers.utils.parseEther("1") });

    await gemstoneExtraction.connect(addr1).processingGem(1);
    const gem = await gemstoneExtraction.minedGems(1);
    expect(gem.purchased).to.equal(true);
  });

  it("should allow a new owner to be marked", async function () {
    await gemstoneExtraction.connect(owner).gemMining("Ruby", ethers.utils.parseEther("1"), "Hash", false, "https://example.com/gem.jpg");
    await gemstoneExtraction.connect(addr1).purchaseGem(1, { value: ethers.utils.parseEther("1") });

    await gemstoneExtraction.connect(addr2).markNewOwner(1, { value: ethers.utils.parseEther("1") });
    const gem = await gemstoneExtraction.minedGems(1);
    expect(gem.owner).to.equal(addr2.address);
  });

  it("should revert if insufficient funds are sent to mark a new owner", async function () {
    await gemstoneExtraction.connect(owner).gemMining("Ruby", ethers.utils.parseEther("1"), "Hash", false, "https://example.com/gem.jpg");
    await gemstoneExtraction.connect(addr1).purchaseGem(1, { value: ethers.utils.parseEther("1") });

    await expect(
      gemstoneExtraction.connect(addr3).markNewOwner(1, { value: ethers.utils.parseEther("0.5") })
    ).to.be.revertedWith("Insufficient funds");
  });

  it("should revert if the gem has already been selected", async function () {
    await gemstoneExtraction.connect(owner).gemMining("Ruby", ethers.utils.parseEther("1"), "Hash", false, "https://example.com/gem.jpg");
    await gemstoneExtraction.connect(addr1).purchaseGem(1, { value: ethers.utils.parseEther("1") });
    await gemstoneExtraction.connect(addr1).markGemAsSelected(1);

    await expect(
      gemstoneExtraction.connect(addr3).markNewOwner(1, { value: ethers.utils.parseEther("1") })
    ).to.be.revertedWith("Gem already selected");
  });

  it("should mark the gem as selected", async function () {
    await gemstoneExtraction.connect(owner).gemMining("Ruby", ethers.utils.parseEther("2"), "newHash", false, "https://example.com/gem.jpg");
    const newGemId = await gemstoneExtraction.minedGemCount();

    await gemstoneExtraction.connect(addr1).purchaseGem(newGemId, { value: ethers.utils.parseEther("2") });
    await gemstoneExtraction.connect(addr1).markGemAsSelected(newGemId);

    const gem = await gemstoneExtraction.minedGems(newGemId);
    expect(gem.selected).to.equal(true);
  });

  it("should return the correct gemstone count for an owner", async function () {
    await gemstoneExtraction.connect(owner).gemMining("Ruby", ethers.utils.parseEther("1"), "Hash", false, "https://example.com/gem.jpg");
    await gemstoneExtraction.connect(addr1).purchaseGem(1, { value: ethers.utils.parseEther("1") });

    const gemCount = await gemstoneExtraction.getGemstoneCountByOwner(addr1.address);
    expect(gemCount.toNumber()).to.equal(1);
  });

  it("should revert if insufficient funds are sent for gem purchase", async function () {
    await gemstoneExtraction.connect(owner).gemMining("Ruby", ethers.utils.parseEther("1"), "Hash", false, "https://example.com/gem.jpg");

    await expect(
      gemstoneExtraction.connect(addr2).purchaseGem(1, { value: ethers.utils.parseEther("0.5") })
    ).to.be.revertedWith("Insufficient funds");
  });
});
