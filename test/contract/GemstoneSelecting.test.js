const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GemstoneSelecting", function () {
  let gemstoneExtraction, gemstoneSelecting, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the GemstoneExtraction mock contract
    const GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
    gemstoneExtraction = await GemstoneExtraction.deploy();
    await gemstoneExtraction.deployed();

    // Deploy the GemstoneSelecting contract with the address of GemstoneExtraction
    const GemstoneSelecting = await ethers.getContractFactory("GemstoneSelecting");
    gemstoneSelecting = await GemstoneSelecting.deploy(gemstoneExtraction.address);
    await gemstoneSelecting.deployed();
  });

  it("should select a new gem", async function () {
    await gemstoneSelecting.connect(owner).gemSelecting(
      1,
      "hash",
      ethers.utils.parseEther("1"),
      "https://example.com/gem.jpg"
    );

    const gem = await gemstoneSelecting.getSelectedGem(1);
    expect(gem.minedGemId).to.equal(1);
    expect(gem.metadataHash).to.equal("hash");
    expect(gem.price).to.equal(ethers.utils.parseEther("1"));
    expect(gem.owner).to.equal(owner.address);
    expect(gem.gemCutter).to.equal(owner.address);
    expect(gem.fileURL).to.equal("https://example.com/gem.jpg");
  });

  it("should toggle gem polish state (forSale)", async function () {
    await gemstoneSelecting.connect(owner).gemSelecting(
      1,
      "hash",
      ethers.utils.parseEther("1"),
      "https://example.com/gem.jpg"
    );

    await gemstoneSelecting.connect(owner).polishGem(1);
    let gem = await gemstoneSelecting.getSelectedGem(1);
    expect(gem.forSale).to.equal(true);

    await gemstoneSelecting.connect(owner).polishGem(1);
    gem = await gemstoneSelecting.getSelectedGem(1);
    expect(gem.forSale).to.equal(false);
  });

  it("should mark gem as used", async function () {
    await gemstoneSelecting.connect(owner).gemSelecting(
      1,
      "hash",
      ethers.utils.parseEther("1"),
      "https://example.com/gem.jpg"
    );

    await gemstoneSelecting.connect(owner).markGemAsUsed(1);
    const gem = await gemstoneSelecting.getSelectedGem(1);
    expect(gem.used).to.equal(true);
  });

  it("should revert if trying to mark a gem as used that is already used", async function () {
    await gemstoneSelecting.connect(owner).gemSelecting(
      1,
      "hash",
      ethers.utils.parseEther("1"),
      "https://example.com/gem.jpg"
    );

    await gemstoneSelecting.connect(owner).markGemAsUsed(1);
    await expect(gemstoneSelecting.connect(owner).markGemAsUsed(1)).to.be.revertedWith("Gem already used");
  });

  it("should set previous gem ID and mark the previous gem as replaced", async function () {
    await gemstoneSelecting.connect(owner).gemSelecting(
      1,
      "hash",
      ethers.utils.parseEther("1"),
      "https://example.com/gem.jpg"
    );

    await gemstoneSelecting.connect(owner).gemSelecting(
      2,
      "hash2",
      ethers.utils.parseEther("1"),
      "https://example.com/gem2.jpg"
    );

    await gemstoneSelecting.connect(owner).setPreviousGemId(2, 1);
    const gem = await gemstoneSelecting.getSelectedGem(2);
    expect(gem.previousGemId).to.equal(1);

    const previousGem = await gemstoneSelecting.getSelectedGem(1);
    expect(previousGem.replaced).to.equal(true);
  });

  it("should allow gem ownership transfer", async function () {
    await gemstoneSelecting.connect(owner).gemSelecting(
      1,
      "hash",
      ethers.utils.parseEther("1"),
      "https://example.com/gem.jpg"
    );

    await gemstoneSelecting.connect(addr1).transferGemOwnership(1, { value: ethers.utils.parseEther("1") });
    const gem = await gemstoneSelecting.getSelectedGem(1);
    expect(gem.owner).to.equal(addr1.address);
    expect(gem.forSale).to.equal(false);
  });

  it("should revert if insufficient funds are sent to transfer gem ownership", async function () {
    await gemstoneSelecting.connect(owner).gemSelecting(
      1,
      "hash",
      ethers.utils.parseEther("1"),
      "https://example.com/gem.jpg"
    );

    await expect(
      gemstoneSelecting.connect(addr1).transferGemOwnership(1, { value: ethers.utils.parseEther("0.5") })
    ).to.be.revertedWith("Insufficient funds");
  });

  it("should return the correct gemstone count for an owner", async function () {
    await gemstoneSelecting.connect(owner).gemSelecting(
      1,
      "hash",
      ethers.utils.parseEther("1"),
      "https://example.com/gem.jpg"
    );

    await gemstoneSelecting.connect(owner).gemSelecting(
      2,
      "hash2",
      ethers.utils.parseEther("1"),
      "https://example.com/gem2.jpg"
    );

    const gemCount = await gemstoneSelecting.getSelectedGemsCountByOwner(owner.address);
    expect(gemCount.toNumber()).to.equal(2);
  });

  it("should mark gem as replaced", async function () {
    await gemstoneSelecting.connect(owner).gemSelecting(
      1,
      "hash",
      ethers.utils.parseEther("1"),
      "https://example.com/gem.jpg"
    );

    await gemstoneSelecting.connect(owner).markGemAsReplaced(1);
    const gem = await gemstoneSelecting.getSelectedGem(1);
    expect(gem.replaced).to.equal(true);
  });

  it("should revert if trying to mark a gem as replaced that is already replaced", async function () {
    await gemstoneSelecting.connect(owner).gemSelecting(
      1,
      "hash",
      ethers.utils.parseEther("1"),
      "https://example.com/gem.jpg"
    );

    await gemstoneSelecting.connect(owner).markGemAsReplaced(1);
    await expect(gemstoneSelecting.connect(owner).markGemAsReplaced(1)).to.be.revertedWith("Gem already used");
  });
});
