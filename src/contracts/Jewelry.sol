pragma solidity >=0.4.21 <0.6.0;

interface IGemstoneSelecting {
    function selectedGems(uint) external view returns (uint id, uint minedGemId, uint weight, uint height, uint width, uint diameter, uint carat, string memory color, string memory gemType, bool forSale, uint price, bool used, address owner);
    function markGemAsUsed(uint _id) external;
}

contract Jewelry {
    IGemstoneSelecting gemstoneSelecting;
    uint public jewelryCount = 0;
    mapping(uint => JewelryData) public jewelry;
    //uint[] initialPreviousGems;

    struct JewelryData {
        uint id;
        string name;
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

    constructor() public {
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

    // Initialize an array with one element, the provided gem ID
    jewelry[jewelryCount].previousGemIds.push(_gemId);

    jewelry[jewelryCount] = JewelryData(
        jewelryCount,
        _name, // Assign the initialized array here
        new uint[](0),
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
        _metal,
        _size,
        _sale,
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
        string memory metal, 
        string memory size, 
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
            jew.metal,
            jew.size,
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

        jew.previousGemIds.push(_newGemId); // Add new gemId to previousGemIds

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
