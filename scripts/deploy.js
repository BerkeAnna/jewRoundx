const hre = require("hardhat");

async function main() {
  // Deploy GemstoneExtraction
  const GemstoneExtraction = await hre.ethers.getContractFactory("GemstoneExtraction");
  const gemstoneExtraction = await GemstoneExtraction.deploy();
  await gemstoneExtraction.deployed();
  console.log("GemstoneExtraction deployed to:", gemstoneExtraction.address);

  // Deploy GemstoneSelecting, a GemstoneExtraction címével
  const GemstoneSelecting = await hre.ethers.getContractFactory("GemstoneSelecting");
  const gemstoneSelecting = await GemstoneSelecting.deploy(gemstoneExtraction.address);
  await gemstoneSelecting.deployed();
  console.log("GemstoneSelecting deployed to:", gemstoneSelecting.address);

  // Deploy Jewelry, a GemstoneExtraction vagy GemstoneSelecting címével (ha szükséges)
  const Jewelry = await hre.ethers.getContractFactory("Jewelry");
  const jewelry = await Jewelry.deploy(gemstoneExtraction.address);  // vagy gemstoneSelecting.address
  await jewelry.deployed();
  console.log("Jewelry deployed to:", jewelry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
