const { expect } = require("chai");

describe.only("Full Test", function () {
    let Jewelry, jewelry, GemstoneSelecting, gemstoneSelecting, GemstoneExtraction, gemstoneExtraction;
    let miner, cutter, jeweler, jewOwner;

    before(async function () {
        [miner, cutter, jeweler, jewOwner] = await ethers.getSigners();
        GemstoneExtraction = await ethers.getContractFactory("GemstoneExtraction");
        gemstoneExtraction = await GemstoneExtraction.deploy();
        await gemstoneExtraction.deployed();

        GemstoneSelecting = await ethers.getContractFactory("GemstoneSelecting");
        gemstoneSelecting = await GemstoneSelecting.deploy(gemstoneExtraction.address);
        await gemstoneSelecting.deployed();

        Jewelry = await ethers.getContractFactory("Jewelry");
        jewelry = await Jewelry.deploy(gemstoneSelecting.address);
        await jewelry.deployed();
    });

    it("should mine a gem and emit GemMining event", async function () {
        const gemType = "Ruby";
        const details = "red ruby";
        const price = ethers.utils.parseEther("1");
        const miningLocation = "Africa";
        const miningYear = 2024;
        const fileURL = "https://example.com/gem.jpg";
        const purchased = false;

        await expect(
            gemstoneExtraction.gemMining(
                gemType,
                details,
                price,
                miningLocation,
                miningYear,
                fileURL,
                purchased
            )
        )
            .to.emit(gemstoneExtraction, "GemMining")
            .withArgs(
                1,
                gemType,
                details,
                price,
                miningLocation,
                miningYear,
                false, // selected 
                miner.address,
                miner.address,
                fileURL,
                purchased
            );

        const minedGem = await gemstoneExtraction.minedGems(1);
        expect(minedGem.gemType).to.equal(gemType);
        expect(minedGem.details).to.equal(details);
        expect(minedGem.price).to.equal(price);
        expect(minedGem.miningLocation).to.equal(miningLocation);
        expect(minedGem.miningYear).to.equal(miningYear);
        expect(minedGem.selected).to.be.false;
        expect(minedGem.miner).to.equal(miner.address);
        expect(minedGem.owner).to.equal(miner.address);
        expect(minedGem.fileURL).to.equal(fileURL);
        expect(minedGem.purchased).to.equal(purchased);
    });

    it("should allow purchase of a gem and emit GemPurchased event", async function () {
        const gemId = 1;
        const gemPrice = ethers.utils.parseEther("1");

        await expect(
            gemstoneExtraction.connect(miner).purchaseGem(gemId, { value: gemPrice })
        )
            .to.emit(gemstoneExtraction, "GemPurchased")
            .withArgs(
                gemId,
                "Ruby",
                "red ruby",
                gemPrice,
                "Africa",
                2024,
                false,
                miner.address,
                miner.address,
                "https://example.com/gem.jpg",
                true
            );

        const minedGem = await gemstoneExtraction.minedGems(gemId);
        expect(minedGem.miner).to.equal(miner.address);
        expect(minedGem.purchased).to.be.true;
    });

    it("should allow a new owner to be marked and emit MarkNewOwner event", async function () {
        const gemId = 1;
        const gemPrice = ethers.utils.parseEther("1");
        const minerBalance = await miner.getBalance();

        await expect(
            gemstoneExtraction.connect(cutter).markNewOwner(gemId, { value: gemPrice })
        )
            .to.emit(gemstoneExtraction, "MarkNewOwner")
            .withArgs(
                gemId,
                "Ruby",
                "red ruby",
                gemPrice,
                "Africa",
                2024,
                false, // selected értéke
                miner.address,
                cutter.address,
                "https://example.com/gem.jpg",
                true
            );

        // ell, hogy az `owner` mező megváltozott
        const minedGem = await gemstoneExtraction.minedGems(gemId);
        expect(minedGem.owner).to.equal(cutter.address);

        // ell, hogy az Ether át lett utalva, figyelembe véve a gázköltségeket
        const finalBalance = await miner.getBalance();

        console.log("minerBalance", minerBalance)
        console.log("finalBalance", finalBalance)
        expect(finalBalance.sub(minerBalance)).to.be.closeTo(gemPrice, ethers.utils.parseEther("0.001"));
    });

    it("Should select a new gem", async function () {
        const gemId = 1;
        const gemPrice = ethers.utils.parseEther("1");
        const gemDetails = {
            size: "2x2x2",
            carat: ethers.BigNumber.from(2),
            gemType: "Ruby",
            color: "red"
        };

        await expect(
            gemstoneSelecting.connect(cutter).gemSelecting(
                gemId,
                gemDetails,
                "fileUrl",
                gemPrice
            )
        )
            .to.emit(gemstoneSelecting, "GemSelecting")
            .withArgs(
                gemId,
                gemId,
                gemDetails,
                false,           // forSale
                "fileUrl",
                gemPrice,
                false,           // used
                false,           // replaced
                cutter.address,
                cutter.address
            );


        const selectedGem = await gemstoneSelecting.getSelectedGem(gemId);
        expect(selectedGem.id).to.equal(gemId);
        expect(selectedGem.minedGemId).to.equal(gemId);
        expect(selectedGem.details.size).to.equal("2x2x2");
        expect(selectedGem.details.carat).to.equal(ethers.BigNumber.from(2));
        expect(selectedGem.details.gemType).to.equal("Ruby");
        expect(selectedGem.details.color).to.equal("red");
        expect(selectedGem.forSale).to.equal(false);
        expect(selectedGem.fileURL).to.equal("fileUrl");
        expect(selectedGem.price).to.equal(gemPrice);
        expect(selectedGem.used).to.equal(false);
        expect(selectedGem.replaced).to.equal(false);
        expect(selectedGem.owner).to.equal(cutter.address);
        expect(selectedGem.gemCutter).to.equal(cutter.address);
    });

    it("Should toggle the 'forSale' status when polishGem is called", async function () {

        await expect( gemstoneSelecting.connect(cutter).polishGem(1))
            .to.emit(gemstoneSelecting, "PolishGem")
            .withArgs(
                1,                   // id
                1,                   // minedGemId
                {
                    size: "2x2x2",
                    carat: ethers.BigNumber.from(2),
                    gemType: "Ruby",
                    color: "red"
                },                   
                true,                 // forSale
                "fileUrl",            
                ethers.utils.parseEther("1"), 
                false,                // used
                false,                // replaced
                cutter.address,       // owner
                cutter.address        // gemCutter
            );

        let selectedGem = await gemstoneSelecting.getSelectedGem(1);
        expect(selectedGem.forSale).to.be.true;

        await gemstoneSelecting.connect(cutter).polishGem(1);

        selectedGem = await gemstoneSelecting.getSelectedGem(1);
        expect(selectedGem.forSale).to.be.false;
    });

    it("Should click the 'forSale' button", async function () {

        
        await expect( gemstoneSelecting.connect(cutter).polishGem(1))
            .to.emit(gemstoneSelecting, "PolishGem")
            .withArgs(
                1,                   // id
                1,                   // minedGemId
                {
                    size: "2x2x2",
                    carat: ethers.BigNumber.from(2),
                    gemType: "Ruby",
                    color: "red"
                },                   
                true,                 // forSale
                "fileUrl",            
                ethers.utils.parseEther("1"), 
                false,                // used
                false,                // replaced
                cutter.address,       // owner
                cutter.address        // gemCutter
            );

        let selectedGem = await gemstoneSelecting.getSelectedGem(1);
        expect(selectedGem.forSale).to.be.true;

    });

    it("Should buy a selected gem", async function () {
        const gemId = 1;
        const gemPrice = ethers.utils.parseEther("1");

        const cutterBalance = await cutter.getBalance();
        const jewelerBalance = await jeweler.getBalance();

        await expect (gemstoneSelecting.connect(jeweler).transferGemOwnership(gemId, { value: gemPrice }))
            .to.emit(gemstoneSelecting, "TransferGemOwnership")
            .withArgs(
                1,                   // id
                1,                   // minedGemId
                {
                    size: "2x2x2",
                    carat: ethers.BigNumber.from(2),
                    gemType: "Ruby",
                    color: "red"
                },                   
                false,                 // forSale
                "fileUrl",            
                ethers.utils.parseEther("1"), 
                false,                // used
                false,                // replaced
                jeweler.address,       // owner
                cutter.address        // gemCutter
            );

        const finalCutterBalance = await cutter.getBalance();
        const finalJewelerBalance = await jeweler.getBalance();

        const selectedGem = await gemstoneSelecting.getSelectedGem(gemId);
        expect(selectedGem.forSale).to.be.false;
        expect(selectedGem.owner).to.equal(jeweler.address);

        expect(finalCutterBalance.sub(cutterBalance)).to.be.closeTo(gemPrice, ethers.utils.parseEther("0.001"));
        expect(jewelerBalance.sub(finalJewelerBalance)).to.be.closeTo(gemPrice, ethers.utils.parseEther("0.001"));

        console.log("cutterBalance", cutterBalance)
        console.log("jewelerBalance", jewelerBalance)
        console.log("finalCutterBalance", finalCutterBalance)
        console.log("finalJewelerBalance", finalJewelerBalance)
    });

    it("Should make a jewelry", async function () {
        const gemId = 1;
        const name = "Ruby Ring";
        const physicalDetails = "sampleMetadataHash";
        const price = ethers.utils.parseEther("1");
        const fileURL = "https://example.com/jewelry1";

        await expect(
            jewelry.connect(jeweler).jewelryMaking(
                name,
                gemId,
                physicalDetails,
                false,
                price,
                fileURL
            )
        )
            .to.emit(jewelry, "JewelryMaking")
            .withArgs(
                1,
                name,
                physicalDetails,
                false,     //sale
                true,            // processing 
                price,
                fileURL,
                jeweler.address,
                jeweler.address,
                jeweler.address
            );

        const jewelryDetails = await jewelry.getJewelryDetails(1);
        expect(jewelryDetails.id).to.equal(1);
        expect(jewelryDetails.name).to.equal(name);
        expect(jewelryDetails.previousGemIds[0]).to.equal(gemId);
        expect(jewelryDetails.physicalDetails).to.equal(physicalDetails);
        expect(jewelryDetails.sale).to.equal(false);
        expect(jewelryDetails.processing).to.equal(true);
        expect(jewelryDetails.price).to.equal(price);
        expect(jewelryDetails.fileURL).to.equal(fileURL);
        expect(jewelryDetails.jeweler).to.equal(jeweler.address);
        expect(jewelryDetails.owner).to.equal(jeweler.address);
        expect(jewelryDetails.jewOwner).to.equal(jeweler.address);
    });

    it("Should add a gem in the jewelry item", async function () {
        const jewelryId = 1;
        const gemId = 2;
        const gemType = "Ruby";
        const details = "red ruby";
        const price = ethers.utils.parseEther("1");
        const miningLocation = "Africa";
        const miningYear = 2024;
        const fileURL = "https://example.com/gem.jpg";
        const purchased = false;
        const gemPrice = ethers.utils.parseEther("1");

        await gemstoneExtraction.gemMining(
            gemType,
            details,
            price,
            miningLocation,
            miningYear,
            fileURL,
            purchased
        )
        await gemstoneExtraction.connect(miner).purchaseGem(gemId, { value: gemPrice })
        await gemstoneExtraction.connect(cutter).markNewOwner(gemId, { value: gemPrice })


        const gemDetails = {
            size: "2x2x2",
            carat: ethers.BigNumber.from(2),
            gemType: "Ruby",
            color: "red"
        };

        await gemstoneSelecting.connect(cutter).gemSelecting(
            gemId,
            gemDetails,
            "fileUrl",
            gemPrice
        )

        await gemstoneSelecting.connect(cutter).polishGem(1);

        await gemstoneSelecting.connect(jeweler).transferGemOwnership(gemId, { value: gemPrice });

        await expect(jewelry.connect(jeweler).updateGem(jewelryId, gemId))
            .to.emit(jewelry, "GemUpdated")
            .withArgs(jewelryId, gemId);

        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.previousGemIds.map(id => id.toNumber())).to.include(gemId);
    });


    it("Should mark the jewelry as finished", async function () {
        const jewelryId = 1;

        await expect(jewelry.connect(jeweler).markedAsFinished(jewelryId))
        .to.emit(jewelry, "JewelryFinished")
        .withArgs(
            jewelryId,
            jeweler.address
        );
        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.processing).to.equal(false);
    });

    it("Should toggle jewelry sale state", async function () {
        const jewelryId = 1;

        await expect(jewelry.connect(jeweler).markedAsSale(jewelryId))
        .to.emit(jewelry, "JewelrySale")
        .withArgs(
            jewelryId,
            jeweler.address
        );

    const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
    expect(jewelryDetails.sale).to.equal(true);

    await expect(jewelry.connect(jeweler).markedAsSale(jewelryId))
        .to.emit(jewelry, "JewelrySale")
        .withArgs(
            jewelryId,
            jeweler.address
        );
    const jewelryDetailsRemove = await jewelry.getJewelryDetails(jewelryId);
    expect(jewelryDetailsRemove.sale).to.equal(false);
    });

    it("Should sale jewelry", async function () {
        const jewelryId = 1;

        await expect(jewelry.connect(jeweler).markedAsSale(jewelryId))
        .to.emit(jewelry, "JewelrySale")
        .withArgs(
            jewelryId,
            jeweler.address
        );

        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.sale).to.equal(true);
    });

    it("Should add jewelry for repair", async function () {
        const jewelryId = 1;

        await jewelry.connect(jeweler).addForRepair(jewelryId);

        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.owner).to.equal(jewelryDetails.jeweler);
    });

    it("Should repair a gem in the jewelry item", async function () {
        const jewelryId = 1;
        const gemId = 2;
        const newGemId = 3;
        const gemType = "Ruby";
        const details = "red ruby";
        const price = ethers.utils.parseEther("1");
        const miningLocation = "Africa";
        const miningYear = 2024;
        const fileURL = "https://example.com/gem.jpg";
        const purchased = false;
        const gemPrice = ethers.utils.parseEther("1");

        await gemstoneExtraction.gemMining(gemType, details, price, miningLocation, miningYear, fileURL, purchased);

        let minedGem = await gemstoneExtraction.minedGems(newGemId);
        console.log("Mined Gem State before purchase:", minedGem);

        await gemstoneExtraction.connect(miner).purchaseGem(newGemId, { value: gemPrice });

        minedGem = await gemstoneExtraction.minedGems(newGemId);
        console.log("Mined Gem State after purchase:", minedGem);
        await gemstoneExtraction.connect(cutter).markNewOwner(newGemId, { value: gemPrice });

        const gemDetails = {
            size: "2x2x2",
            carat: ethers.BigNumber.from(2),
            gemType: "Ruby",
            color: "red"
        };

        await gemstoneSelecting.connect(cutter).gemSelecting(newGemId, gemDetails, "fileUrl", gemPrice);
        await gemstoneSelecting.connect(cutter).polishGem(1);
        await gemstoneSelecting.connect(jeweler).transferGemOwnership(newGemId, { value: gemPrice });

        await expect(gemstoneSelecting.connect(jeweler).markGemAsUsed(newGemId))
            .to.emit(gemstoneSelecting, "MarkGemAsUsed")
            .withArgs(
                newGemId,
                newGemId,
                gemDetails,
                false,                       // forSale
                "fileUrl",
                ethers.utils.parseEther("1"),
                true,                        // used
                false,                       // replaced
                jeweler.address,
                cutter.address
            );

        await expect(gemstoneSelecting.connect(jeweler).markGemAsReplaced(newGemId))
            .to.emit(gemstoneSelecting, "MarkGemAsUsed")
            .withArgs(
                newGemId,
                newGemId,
                gemDetails,
                false,                       // forSale
                "fileUrl",
                ethers.utils.parseEther("1"),
                true,                        // used
                true,                        // replaced
                jeweler.address,
                cutter.address
            );

        await expect(jewelry.connect(jeweler).replaceGem(jewelryId, gemId, newGemId))
            .to.emit(jewelry, "GemReplaced")
            .withArgs(jewelryId, newGemId);

        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.previousGemIds.map(id => id.toNumber())).to.include(gemId);
    });



    it("Should return jewelry to the original owner", async function () {
        const jewelryId = 1;

        await expect(jewelry.connect(jeweler).returnToJewOwner(jewelryId))
        .to.emit(jewelry, "ReturnToJewOwner")
        .withArgs(
            jewelryId,
            jeweler.address,
            jeweler.address
        );

        const jewelryDetails = await jewelry.getJewelryDetails(jewelryId);
        expect(jewelryDetails.owner).to.equal(jewelryDetails.jewOwner);
    });

    //todo: negative tests
    //todo: emits
    //todo: check current tests
});