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
        uint size; //mekkora ujjra valo pl
        uint date;
        bool sale;
        uint price;
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
        uint size,
        uint date,
        bool sale,
        uint price,
        address payable jeweler,
        address payable owner
    );

     constructor(address _gemstoneSelectingAddress) public {
        gemstoneSelecting = IGemstoneSelecting(_gemstoneSelectingAddress);
    }

    function jewelryMaking(string memory _name, uint _gemId, string memory _metal, uint _depth, uint _height, uint _width, uint _size, uint _date, bool _sale, uint _price ) public {
     (,,,,,,, , , , , bool used, ) = gemstoneSelecting.selectedGems(_gemId);
require(!used, "Gem already used");
        
        require( _depth > 0);
        require( _height > 0);
        require( _width > 0);
        require( _price > 0);
        require( _gemId > 0, "GemId cannot be empty");
        require(bytes(_name).length > 0, "Name cannot be empty");
        jewelryCount++;
       jewelry[jewelryCount] = JewelryData(jewelryCount, _name, _gemId, _metal, _depth, _height, _width, _size, _date, _sale, _price, msg.sender, msg.sender);

       emit JewelryMaking(jewelryCount, _name, _gemId, _metal, _depth, _height, _width, _size, _date, _sale, _price, msg.sender, msg.sender);

    
    }

 
}