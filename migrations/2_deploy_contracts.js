const GemstoneExtraction = artifacts.require("GemstoneExtraction");
const GemstoneSelecting = artifacts.require("GemstoneSelecting");

module.exports = function(deployer) {
  deployer.deploy(GemstoneExtraction);
  deployer.deploy(GemstoneSelecting);
};
