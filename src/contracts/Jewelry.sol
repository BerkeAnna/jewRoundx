pragma solidity >=0.4.21 <0.6.0;

interface IGemstoneSelecting {
    function selectedGems(uint) external view returns (uint id, uint minedGemId, uint weight, uint height, uint width, uint diameter, uint carat, string memory color, string memory gemType, bool polishing, uint price, bool used, address owner);
    function markGemAsUsed(uint _id) external;
}

contract Jewelry {
    
    IGemstoneSelecting gemstoneSelecting;

    /*struct GoldData{
        string name;
        uint gemId;
        uint goldCarat;

    }

     struct SilverData{
        string name;
        uint gemId;

    }

     struct MedicalMetalData{
        string name;
        uint gemId;

    }*/

    uint public jewelryCount = 0;
    mapping( uint => JewelryData) public jewelry;

    struct JewelryData{
        uint id;
        string name;
        uint gemId;
        string metal;
        uint depth;
        uint height;
        uint width;
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
        uint depth,
        uint height,
        uint width,
        bool sale,
        uint price,
        string fileURL,
        address payable jeweler,
        address payable owner
    );
    
    event JewelryBought(
        uint id,
        address payable newOwner
    );

     constructor(address _gemstoneSelectingAddress) public {
        gemstoneSelecting = IGemstoneSelecting(_gemstoneSelectingAddress);
    }

    function jewelryMaking(string memory _name, uint _gemId, string memory _metal, uint _depth, uint _height, uint _width,  bool _sale, uint _price, string memory _fileURL ) public {
     //  (, , , , , , , , , , , bool used, ) = gemstoneSelecting.selectedGems(_gemId);
     //   require(!used, "Gem already used");
        
        jewelryCount++;
       jewelry[_gemId] = JewelryData(_gemId, _name, _gemId, _metal, _depth, _height, _width, _sale, _price, _fileURL, msg.sender, msg.sender);

       emit JewelryMaking(_gemId, _name, _gemId, _metal, _depth, _height, _width, _sale, _price, _fileURL, msg.sender, msg.sender);

    
    }

     function buyJewelry(uint _id) public payable {
        JewelryData storage jew = jewelry[_id];
        require(jew.sale, "Jewelry is not for sale");
        require(msg.value <= jew.price, "Insufficient funds");

        jew.owner.transfer(msg.value);
        jew.owner = msg.sender;

        emit JewelryBought(_id, msg.sender);
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