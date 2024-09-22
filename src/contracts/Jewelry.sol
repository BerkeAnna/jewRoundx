pragma solidity >=0.4.21 <0.6.0;

interface IGemstoneSelecting {
    function selectedGems(uint) external view returns (
        uint id, 
        uint minedGemId, 
        uint weight, 
        uint height, 
        uint width, 
        uint diameter, 
        uint carat, 
        string memory color, 
        string memory gemType, 
        bool forSale, 
        uint price, 
        bool used, 
        address owner
    );
    function markGemAsUsed(uint _id) external;
    function setPreviousGemId(uint gemId, uint previousGemId) external;
}

contract Jewelry {
    IGemstoneSelecting gemstoneSelecting;
    uint public jewelryCount = 0;
    mapping(uint => JewelryData) public jewelry;

    struct JewelryData {
        uint id;
        string name;
        uint[] previousGemIds;
        string physicalDetails;
        bool sale;
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
    event GemReplaced(uint jewelryId, uint newGemId);
    event JewelryFinished(uint id, address owner);
    event JewelrySale(uint id, address owner);

    constructor(address _gemstoneSelectingAddress) public {
        gemstoneSelecting = IGemstoneSelecting(_gemstoneSelectingAddress);
    }

    function jewelryMaking(
        string memory _name,
        uint _gemId,
        string memory _physicalDetails,
        bool _sale,
        uint _price,
        string memory _fileURL
    ) public {
        jewelryCount++;

        jewelry[jewelryCount] = JewelryData(
            jewelryCount,
            _name,
            new uint[](0), // Kezdetben üres gem ID-k tömbje
            _physicalDetails,    // Tárolja a kombinált fizikai részleteket
            _sale,
            true,
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
            _sale,
            true,
            _price,
            _fileURL,
            msg.sender,
            msg.sender
        );
    }

    function replaceGem(uint jewelryId, uint oldGemId, uint newGemId) public {
        gemstoneSelecting.setPreviousGemId(newGemId, oldGemId);

        JewelryData storage jew = jewelry[jewelryId];
        jew.previousGemIds.push(newGemId);

        emit GemReplaced(jewelryId, newGemId);
    }

    function getJewelryDetails(uint _id) public view returns (
        uint id,
        string memory name,
        uint[] memory previousGemIds,
        string memory physicalDetails,
        bool processing,
        bool sale,
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
            jew.processing,
            jew.sale,
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

    function markedAsFinished(uint _id) public payable {
        JewelryData storage _jewelry = jewelry[_id];
        require(_jewelry.id > 0 && _jewelry.id <= jewelryCount, "Invalid jew ID");
        require(_jewelry.processing == true, "Jewelry already finished");

        _jewelry.processing = false;
        _jewelry.sale = false;

        emit JewelryFinished(_id, _jewelry.owner);
    }

    function markedAsSale(uint _id) public payable {
        JewelryData storage _jewelry = jewelry[_id];
        require(_jewelry.id > 0 && _jewelry.id <= jewelryCount, "Invalid jew ID");

        _jewelry.sale = !_jewelry.sale ;

        emit JewelrySale(_id, _jewelry.owner);
    }

}
