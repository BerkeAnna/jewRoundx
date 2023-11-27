const GemstoneExtraction = artifacts.require("GemstoneExtraction");

module.exports = function(deployer) {
  deployer.deploy(GemstoneExtraction);
};
