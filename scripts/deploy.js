const hre = require("hardhat");

async function main() {
  try {
    // Deploy GemstoneExtraction
    const GemstoneExtraction = await hre.ethers.getContractFactory("GemstoneExtraction");
    const gemstoneExtraction = await GemstoneExtraction.deploy();
    await gemstoneExtraction.deployed();
    console.log("GemstoneExtraction deployed to:", gemstoneExtraction.address);

    // Deploy GemstoneSelecting with GemstoneExtraction's address
    const GemstoneSelecting = await hre.ethers.getContractFactory("GemstoneSelecting");
    const gemstoneSelecting = await GemstoneSelecting.deploy(gemstoneExtraction.address);
    await gemstoneSelecting.deployed();
    console.log("GemstoneSelecting deployed to:", gemstoneSelecting.address);

    // Deploy Jewelry with GemstoneExtraction or GemstoneSelecting's address
    const Jewelry = await hre.ethers.getContractFactory("Jewelry");
    const jewelry = await Jewelry.deploy(gemstoneExtraction.address);  // or gemstoneSelecting.address if needed
    await jewelry.deployed();
    console.log("Jewelry deployed to:", jewelry.address);

  } catch (error) {
    console.error("Error in deployment:", error);
    process.exitCode = 1;
  }
}

main();
