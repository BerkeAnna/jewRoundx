const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Jewelry", function () {
  let jewelry, gemstoneSelecting, owner, addr1, addr2;
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
  
    // Deploy the GemstoneExtraction contract
    const GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
    gemstoneExtraction = await GemstoneExtraction.deploy();
    await gemstoneExtraction.deployed();
  
    // Deploy the GemstoneSelecting contract with the address of GemstoneExtraction
    const GemstoneSelecting = await ethers.getContractFactory("GemstoneSelecting");
    gemstoneSelecting = await GemstoneSelecting.deploy(gemstoneExtraction.address); // Átadjuk a címet
    await gemstoneSelecting.deployed();
  
    // Ellenőrizzük, hogy a gemstoneSelecting.address megfelelően van-e megadva
    if (!gemstoneSelecting.address) {
      throw new Error("Failed to deploy GemstoneSelecting contract.");
    }
  
    // Deploy the Jewelry contract with the address of the deployed GemstoneSelecting contract
    const Jewelry = await ethers.getContractFactory("Jewelry");
    jewelry = await Jewelry.deploy(gemstoneSelecting.address); // Átadjuk a címet
    await jewelry.deployed();
  });
  
  

  it("should create a new jewelry item", async function () {
    await jewelry.connect(owner).jewelryMaking(
      "Diamond Ring",
      1,
      "hash",
      true,
      ethers.utils.parseEther("1"),
      "https://example.com/jewelry.jpg"
    );

    const jew = await jewelry.getJewelryDetails(1);
    expect(jew.name).to.equal("Diamond Ring");
    expect(jew.metadataHash).to.equal("hash");
    expect(jew.sale).to.equal(true);
    expect(jew.price).to.equal(ethers.utils.parseEther("1"));
    expect(jew.jeweler).to.equal(owner.address);
    expect(jew.owner).to.equal(owner.address);
  });

  it("should allow buying a jewelry item", async function () {
    await jewelry.connect(owner).jewelryMaking(
      "Diamond Ring",
      1,
      "hash",
      true,
      ethers.utils.parseEther("1"),
      "https://example.com/jewelry.jpg"
    );

    await jewelry.connect(addr1).buyJewelry(1, { value: ethers.utils.parseEther("1") });
    const jew = await jewelry.getJewelryDetails(1);
    expect(jew.owner).to.equal(addr1.address);
    expect(jew.jewOwner).to.equal(addr1.address);
    expect(jew.sale).to.equal(false);
  });

  it("should replace a gem in the jewelry item", async function () {
    await gemstoneSelecting.connect(owner).gemSelecting(
      1, "hash", ethers.utils.parseEther("1"), "https://example.com/gem.jpg"
    );

    await jewelry.connect(owner).jewelryMaking(
      "Diamond Ring", 1, "hash", true, ethers.utils.parseEther("1"), "https://example.com/jewelry.jpg"
    );

    await jewelry.connect(owner).replaceGem(1, 1, 2);

    const jew = await jewelry.getJewelryDetails(1);

    // Convert BigNumbers in previousGemIds to strings before comparison
    const previousGemIdsAsStrings = jew.previousGemIds.map(id => id.toString());
    expect(previousGemIdsAsStrings).to.include("2");
  });

  

  it("should mark jewelry as finished", async function () {
    await jewelry.connect(owner).jewelryMaking(
      "Diamond Ring",
      1,
      "hash",
      true,
      ethers.utils.parseEther("1"),
      "https://example.com/jewelry.jpg"
    );

    await jewelry.connect(owner).markedAsFinished(1);
    const jew = await jewelry.getJewelryDetails(1);
    expect(jew.processing).to.equal(false);
    expect(jew.sale).to.equal(false);
  });

  it("should toggle jewelry sale state", async function () {
    await jewelry.connect(owner).jewelryMaking(
      "Diamond Ring",
      1,
      "hash",
      false,
      ethers.utils.parseEther("1"),
      "https://example.com/jewelry.jpg"
    );

    await jewelry.connect(owner).markedAsSale(1);
    let jew = await jewelry.getJewelryDetails(1);
    expect(jew.sale).to.equal(true);

    await jewelry.connect(owner).markedAsSale(1);
    jew = await jewelry.getJewelryDetails(1);
    expect(jew.sale).to.equal(false);
  });

  it("should add jewelry for repair", async function () {
    await jewelry.connect(owner).jewelryMaking(
      "Diamond Ring",
      1,
      "hash",
      true,
      ethers.utils.parseEther("1"),
      "https://example.com/jewelry.jpg"
    );

    await jewelry.connect(owner).addForRepair(1);
    const jew = await jewelry.getJewelryDetails(1);
    expect(jew.owner).to.equal(jew.jeweler);
    expect(jew.sale).to.equal(false);
  });

  it("should return jewelry to the original owner", async function () {
    await jewelry.connect(owner).jewelryMaking(
      "Diamond Ring",
      1,
      "hash",
      true,
      ethers.utils.parseEther("1"),
      "https://example.com/jewelry.jpg"
    );

    await jewelry.connect(owner).addForRepair(1);
    await jewelry.connect(owner).returnToJewOwner(1);

    const jew = await jewelry.getJewelryDetails(1);
    expect(jew.owner).to.equal(jew.jewOwner);
    expect(jew.sale).to.equal(false);
  });

  it("should return the correct jewelry count for an owner", async function () {
    await jewelry.connect(owner).jewelryMaking(
      "Diamond Ring",
      1,
      "hash",
      true,
      ethers.utils.parseEther("1"),
      "https://example.com/jewelry.jpg"
    );

    await jewelry.connect(owner).jewelryMaking(
      "Emerald Necklace",
      2,
      "hash2",
      false,
      ethers.utils.parseEther("2"),
      "https://example.com/jewelry2.jpg"
    );

    const count = await jewelry.getJewelryCountByOwner(owner.address);
    expect(count.toNumber()).to.equal(2);
  });

  it("should return the correct jewelry count for a jeweler", async function () {
    await jewelry.connect(owner).jewelryMaking(
      "Diamond Ring",
      1,
      "hash",
      true,
      ethers.utils.parseEther("1"),
      "https://example.com/jewelry.jpg"
    );

    const count = await jewelry.getJewelryCountByJeweler(owner.address);
    expect(count.toNumber()).to.equal(1);
  });

  it("should update a gem in the jewelry", async function () {
    await jewelry.connect(owner).jewelryMaking(
      "Diamond Ring", 1, "hash", true, ethers.utils.parseEther("1"), "https://example.com/jewelry.jpg"
    );

    await jewelry.connect(owner).updateGem(1, 3);

    const jew = await jewelry.getJewelryDetails(1);

    // Convert BigNumbers in previousGemIds to strings before comparison
    const previousGemIdsAsStrings = jew.previousGemIds.map(id => id.toString());
    expect(previousGemIdsAsStrings).to.include("3");
  });

});
