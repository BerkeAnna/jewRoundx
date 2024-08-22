pragma solidity >=0.4.21 <0.6.0;

interface IGemstoneSelecting {
    function selectedGems(uint) external view returns (uint id, uint minedGemId, uint weight, uint height, uint width, uint diameter, uint carat, string memory color, string memory gemType, bool forSale, uint price, bool used, address owner);
    function markGemAsUsed(uint _id) external;
}

contract Jewelry {
    IGemstoneSelecting gemstoneSelecting;
    uint public jewelryCount = 0;
    mapping(uint => JewelryData) public jewelry;

    struct JewelryData {
        uint id;
        string name;
        uint[] previousGemIds;
        string physicalDetails;  // Combine metal and size into a single string
        bool sale;                // Separate out the `sale` and `processing` fields
        bool processing;
        uint price;
        string fileURL;
        address payable jeweler;
        address payable owner;
    }

    event JewelryMaking(
        uint id,
        string name,
        string physicalDetails,
        bool sale,
        bool processing,
        uint price,
        string fileURL,
        address payable jeweler,
        address payable owner
    );

    event JewelryBought(uint id, address payable newOwner);
    event GemUpdated(uint jewelryId, uint newGemId);
    event JewelryFinished(uint id, address owner);


    constructor(address _gemstoneSelectingAddress) public {
        gemstoneSelecting = IGemstoneSelecting(_gemstoneSelectingAddress);
    }

    function jewelryMaking(
        string memory _name,
        uint _gemId,
        string memory _physicalDetails,  // Accept combined physical details
        bool _sale,
        uint _price,
        string memory _fileURL
    ) public {
        jewelryCount++;

        jewelry[jewelryCount] = JewelryData(
            jewelryCount,
            _name,
            new uint[](0) ,
            _physicalDetails,    // Store the combined physical details
            false,
            true,               // Initialize processing to false
            _price,
            _fileURL,
            msg.sender,
            msg.sender
        );
        jewelry[jewelryCount].previousGemIds.push(_gemId);

        emit JewelryMaking(
            jewelryCount,
            _name,
            _physicalDetails,
            false,
            true,
            _price,
            _fileURL,
            msg.sender,
            msg.sender
        );
    }


 function getJewelryDetails(uint _id) public view returns (
    uint id,
    string memory name,
    uint[] memory previousGemIds, 
    string memory physicalDetails, 
    bool processing,  // <-- Ez a boolean itt van a sorrendben
    bool sale,        // <-- És ez itt van
    uint price,
    string memory fileURL, 
    address jeweler, 
    address owner
) {
    JewelryData storage jew = jewelry[_id];
    return (
        jew.id,
        jew.name,
        jew.previousGemIds,
        jew.physicalDetails,
        jew.processing,  // <-- Ez a helyes sorrend szerint
        jew.sale,        // <-- És ez is
        jew.price,
        jew.fileURL,
        jew.jeweler,
        jew.owner
    );
}



    function buyJewelry(uint _id) public payable {
        JewelryData storage jew = jewelry[_id];
        require(jew.sale, "Jewelry is not for sale");
        require(msg.value >= jew.price, "Insufficient funds");

        jew.owner.transfer(msg.value);
        jew.owner = msg.sender;
        jew.sale = false;

        emit JewelryBought(_id, msg.sender);
    }

    function updateGem(uint _jewelryId, uint _newGemId) public {
        JewelryData storage jew = jewelry[_jewelryId];
        require(msg.sender == jew.owner, "Only the owner can update the gem");

        jew.previousGemIds.push(_newGemId);

        emit GemUpdated(_jewelryId, _newGemId);
    }

    function getJewelryCountByOwner(address _owner) public view returns (uint) {
        uint count = 0;
        for (uint i = 1; i <= jewelryCount; i++) {
            if (jewelry[i].owner == _owner) {
                count++;
            }
        }
        return count;
    }

    function getJewelryCountByJeweler(address _jeweler) public view returns (uint) {
        uint count = 0;
        for (uint i = 1; i <= jewelryCount; i++) {
            if (jewelry[i].jeweler == _jeweler) {
                count++;
            }
        }
        return count;
    }

    //todo: finish: change processing v. to false.
 function markedAsFinished(uint _id) public payable {
    JewelryData storage _jewelry = jewelry[_id];
    require(_jewelry.id > 0 && _jewelry.id <= jewelryCount, "Invalid jew ID");
    require(_jewelry.processing == true, "Jewelry already finished");

    _jewelry.processing = false;  // processing set to false when finished
    _jewelry.sale = true;  // sale set to true, making it available for sale
    emit JewelryFinished(_id, _jewelry.owner);
}

 
 
   function replaceGem(uint oldGemId, uint newGemId) public {
    // Ellenőrizzük, hogy mindkét kő létezik-e
    require(selectedGems[oldGemId].id > 0, "Old gem does not exist.");
    require(selectedGems[newGemId].id > 0, "New gem does not exist.");
    
    // Hozzáférés az új kőhöz
    SelectedGem storage newGem = selectedGems[newGemId];
    
    // Beállítjuk az új kő previousGemId mezőjét a régi kő azonosítójára
    newGem.previousGemId = oldGemId;

    // (Opcionális) Esemény kibocsátása a csere rögzítésére
    emit GemSelecting(
        newGem.id,
        newGem.minedGemId,
        newGem.details.size,
        newGem.details.carat,
        newGem.details.colorGemType, // Combined color and gem type
        newGem.forSale,
        newGem.fileURL,
        newGem.price,
        newGem.used,
        newGem.owner,
        newGem.gemCutter
    );
}


    //todo: add gem working as repair. 
}
