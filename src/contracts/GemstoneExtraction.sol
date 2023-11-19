pragma solidity >=0.4.21 <0.6.0;

contract GemstoneExtraction {

    string public name;
    uint public minedGemCount = 0;

    mapping( uint => MinedGem) public minedGems;

    enum PointOfProcessing {MINED, SALEOFMINEDPRODUCT, SELECTED }

    struct MinedGem {
        uint id;
        string gemType;
        uint weight;
        uint height; //y
        uint lenght; //x
        uint width; //z
        uint price; 
        string miningLocation;
        uint miningYear;
        uint miningMonth;
        PointOfProcessing pointOfProcessing;
        string extractionMethod; //enum?
        address payable owner;
        bool purchased;
    
    }

    event GemMining{
        uint id,
        string gemType,
        uint weight,
        uint height, 
        uint lenght,
        uint width,
        uint price, 
        string miningLocation,
        uint miningYear,
        uint miningMonth,
        PointOfProcessing pointOfProcessing,
        string extractionMethod,
        address payable owner,
        bool purchased;
    }
    
    constructor() public  {
        name = "x";
    }

    public gemMining(string memory _gemType, uint _weight, uint _height, uint _width, uint _price, string memory _miningLocation, uint _miningYear, uint _miningMonth, PointOfProcessing _pointOfProcessing, string memory _extractionMethod,  bool _purchased) public {
        require(bytes(_gemType.lenght) > 0);
        require( _weight > 0);
        require( _height > 0);
        require( _width > 0);
        require( _price > 0);
        require( _miningYear > 0);
        require( _miningMonth > 0);
        require(bytes(_miningLocation.lenght) > 0);
        
        minedGemCount++;
        minedGems[minedGemCount] = MinedGem(minedGemCount, _gemType, _weight, _height, _width, _price, _miningLocation, _miningYear, _miningMonth, _pointOfProcessing, _extractionMethod, msg.sender, false);

        emit GemMining(minedGemCount, _gemType, _weight, _height, _width, _price, _miningLocation, _miningYear, _miningMonth, _pointOfProcessing, _extractionMethod, msg.sender, false);

    }
}