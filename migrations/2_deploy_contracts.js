const GemstoneExtraction = artifacts.require("GemstoneExtraction");
const GemstoneSelecting = artifacts.require("GemstoneSelecting");
const Jewelry = artifacts.require("Jewelry");

module.exports = async function(deployer) {
  await deployer.deploy(GemstoneExtraction);
  const gemstoneExtraction = await GemstoneExtraction.deployed();
  
  await deployer.deploy(GemstoneSelecting, gemstoneExtraction.address);
  const gemstoneSelecting = await GemstoneSelecting.deployed();
  
  await deployer.deploy(Jewelry, gemstoneSelecting.address);
};
