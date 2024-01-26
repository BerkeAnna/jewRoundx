const GemstoneExtraction = artifacts.require("GemstoneExtraction");
const GemstoneSelecting = artifacts.require("GemstoneSelecting");
const Jewelry = artifacts.require("Jewelry");

module.exports = function(deployer) {
  deployer.deploy(GemstoneExtraction);
  deployer.deploy(GemstoneSelecting);
  deployer.deploy(Jewelry);
};
