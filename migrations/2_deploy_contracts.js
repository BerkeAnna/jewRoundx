const GemstoneExtraction = artifacts.require("GemstoneExtraction");
const GemstoneSelecting = artifacts.require("GemstoneSelecting");
const Jewelry = artifacts.require("Jewelry");

module.exports = function(deployer) {
  deployer.deploy(GemstoneExtraction).then(function() {
    // Itt feltételezzük, hogy a GemstoneSelecting szerződés konstruktora várja a GemstoneExtraction szerződés címét
    return deployer.deploy(GemstoneSelecting, GemstoneExtraction.address);
  }).then(function() {
    // Tegyük fel, hogy a Jewelry szerződés nem függ közvetlenül a másik kettőtől, vagy ha igen, hasonló módon kezeljük a függőségeket
    return deployer.deploy(Jewelry);
    // Ha a Jewelry is függ a többitől, hasonló módon adhatjuk át a szükséges címeket
  });
};

