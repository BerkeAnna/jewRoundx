pragma solidity >=0.4.21 <0.6.0;

contract Jewelry {

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

    function jewelryMaking(string memory _name, uint _gemId, string memory _metal, uint _depth, uint _height, uint _width, uint _size, uint _date, bool _sale, uint _price ) public {
         
        jewelryCount++;
       jewelry[jewelryCount] = JewelryData(jewelryCount, _name, _gemId, _metal, _depth, _height, _width, _size, _date, _sale, _price, msg.sender, msg.sender);

       emit JewelryMaking(jewelryCount, _name, _gemId, _metal, _depth, _height, _width, _size, _date, _sale, _price, msg.sender, msg.sender);

    
    }

 
}