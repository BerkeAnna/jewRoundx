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
        uint gemId;
        uint[] previousGemIds; // Array to store the history of previous gem IDs
        string metal;
        string size;
        bool sale;
        uint price;
        string fileURL;
        address payable jeweler;
        address payable owner;
    }

    event JewelryMaking(
        uint id,
        string name,
        uint gemId,
        string metal,
        string size,
        bool sale,
        uint price,
        string fileURL,
        address payable jeweler,
        address payable owner
    );

    event JewelryBought(uint id, address payable newOwner);
    event GemUpdated(uint jewelryId, uint newGemId);

    constructor(address _gemstoneSelectingAddress) public {
        gemstoneSelecting = IGemstoneSelecting(_gemstoneSelectingAddress);
    }

    function jewelryMaking(
        string memory _name,
        uint _gemId,
        string memory _metal,
        string memory _size,
        bool _sale,
        uint _price,
        string memory _fileURL
    ) public {
        jewelryCount++;
        uint[] memory initialPreviousGems = new uint[](0);

        jewelry[jewelryCount] = JewelryData(
            jewelryCount,
            _name,
            _gemId,
            initialPreviousGems,
            _metal,
            _size,
            _sale,
            _price,
            _fileURL,
            msg.sender,
            msg.sender
        );

        emit JewelryMaking(
            jewelryCount,
            _name,
            _gemId,
            _metal,
            _size,
            _sale,
            _price,
            _fileURL,
            msg.sender,
            msg.sender
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

        jew.previousGemIds.push(jew.gemId); // Add current gemId to previousGemIds
        jew.gemId = _newGemId; // Update with the new gemId

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
}
