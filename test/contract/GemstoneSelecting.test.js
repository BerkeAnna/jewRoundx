/*const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GemstoneSelecting", function () {
  let gemstoneSelecting, gemstoneExtraction, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Először deployáljuk a GemstoneExtraction szerződést
    const GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
    gemstoneExtraction = await GemstoneExtraction.deploy();
    await gemstoneExtraction.deployed();

    // Ezután deployáljuk a GemstoneSelecting szerződést, a GemstoneExtraction címével
    const GemstoneSelecting = await ethers.getContractFactory("GemstoneSelecting");
    gemstoneSelecting = await GemstoneSelecting.deploy(gemstoneExtraction.address);
    await gemstoneSelecting.deployed();
  });

  it("should select a new gem", async function () {
    const minedGemId = 1;
    const metadataHash = "Hash";
    const price = ethers.utils.parseEther("1");

    // Kiválasztjuk a drágakövet
    await gemstoneSelecting.connect(owner).gemSelecting(minedGemId, metadataHash, price);

    // Ellenőrizd, hogy a drágakő bejegyzés helyesen tárolódott
    const gem = await gemstoneSelecting.getSelectedGem(minedGemId);
    expect(gem.minedGemId).to.equal(minedGemId);
    expect(gem.metadataHash).to.equal(metadataHash);
    expect(gem.price).to.equal(price);
    expect(gem.owner).to.equal(owner.address);
  });

  it("should toggle gem polish state (forSale)", async function () {
    const gemId = 1;
    await gemstoneSelecting.connect(owner).polishGem(gemId);

    const gem = await gemstoneSelecting.getSelectedGem(gemId);
    expect(gem.forSale).to.equal(true);
  });

  it("should allow gem ownership transfer", async function () {
    const gemId = 1;
    const price = ethers.utils.parseEther("1");

    // Átruházza a drágakövet egy új tulajdonosra
    await gemstoneSelecting.connect(addr1).transferGemOwnership(gemId, { value: price });

    const gem = await gemstoneSelecting.getSelectedGem(gemId);
    expect(gem.owner).to.equal(addr1.address);
  });

  it("should mark gem as used", async function () {
    const gemId = 1;

    // Használatra jelöli a drágakövet
    await gemstoneSelecting.connect(addr1).markGemAsUsed(gemId);

    const gem = await gemstoneSelecting.getSelectedGem(gemId);
    expect(gem.used).to.equal(true);
  });

  it("should set the previous gem ID", async function () {
    const gemId = 1;
    const prevGemId = 0;

    // Beállítja az előző drágakövet
    await gemstoneSelecting.connect(owner).setPreviousGemId(gemId, prevGemId);

    const gem = await gemstoneSelecting.getSelectedGem(gemId);
    expect(gem.previousGemId).to.equal(prevGemId);
  });

  it("should return the correct gemstone count for an owner", async function () {
    const gemCount = await gemstoneSelecting.getSelectedGemsCountByOwner(addr1.address);
    expect(gemCount.toNumber()).to.equal(1);
  });
});
*/