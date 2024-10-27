const { ethers } = require("hardhat");

async function main() {
  const GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
  const gemstoneExtraction = await GemstoneExtraction.deploy();
  await gemstoneExtraction.deployed();

  console.log("GemstoneExtraction deployed to:", gemstoneExtraction.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
