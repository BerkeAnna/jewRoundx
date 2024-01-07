pragma solidity >=0.4.21 <0.6.0;

contract GemstoneExtraction {
// https://www.youtube.com/watch?v=VH9Q2lf2mNo&t=1990s 1:11:54
    string public name;
    uint public minedGemCount = 0;

    mapping( uint => MinedGem) public minedGems;

    enum PointOfProcessing {MINED, SALEOFMINEDPRODUCT,  PREPARATION, PROCESSING }

    struct MinedGem {
        uint id;
        string gemType;
        uint weight;
        uint height; //y
       // uint length; //x
        uint width; //z
        uint price; 
        string miningLocation;
        uint miningYear;
       // uint miningMonth;
        bool selected;
        string extractionMethod; //enum?
        address payable owner;
        bool purchased;
    
    }

    event GemMining(
       uint id,
        string gemType,
        uint weight,
        uint height, 
        uint width,
        uint price, 
        string miningLocation,
        uint miningYear,
         bool selected,
        string extractionMethod,
        address payable owner,
        bool purchasedvv
    );

     event GemPurchasing(
       uint id,
        string gemType,
        uint weight,
        uint height, 
        uint width,
        uint price, 
        string miningLocation,
        uint miningYear,
         bool selected,
        string extractionMethod,
        address payable owner,
        bool purchased
     );

       event GemPurchased(
        uint id,
        string gemType,
        uint weight,
        uint height, 
        uint width,
        uint price, 
        string miningLocation,
        uint miningYear,
         bool selected,
        string extractionMethod,
        address payable owner,
        bool purchased
    );
    
    constructor() public  {
        name = "x";
    }
    function gemMining(string memory _gemType, uint _weight, uint _height, uint _width,  uint _price, string memory _miningLocation, uint _miningYear, string memory _extractionMethod,  bool _purchased) public {
        require(bytes(_gemType).length > 0, "Gem type cannot be empty");
        require( _weight > 0);
        require( _height > 0);
        require( _width > 0);
        require( _price > 0);
        require( _miningYear > 0);
        require(bytes(_miningLocation).length > 0, "Mining location cannot be empty");

        
        minedGemCount++;
       minedGems[minedGemCount] = MinedGem(minedGemCount, _gemType, _weight, _height, _width, _price, _miningLocation, _miningYear, false, _extractionMethod, msg.sender, _purchased);

       emit GemMining(minedGemCount, _gemType, _weight, _height, _width, _price, _miningLocation, _miningYear, false, _extractionMethod, msg.sender, _purchased);

    }

    function purchaseGem(uint _id) public payable {
    require(_id > 0 && _id <= minedGemCount, "Invalid gem ID");
    MinedGem storage _minedGem = minedGems[_id];
    require(!_minedGem.purchased, "Gem already purchased");
    require(msg.value >= _minedGem.price, "Insufficient Ether sent");

    address payable _miner = address(uint160(_minedGem.owner));
    //require(_miner != msg.sender, "Buyer cannot be the owner");

    _minedGem.purchased = true;
    // Update owner to the new buyer
    _minedGem.owner = address(uint160(msg.sender));

    _miner.transfer(msg.value); // Transfer Ether to the original owner

    emit GemPurchased(
        _id,
        _minedGem.gemType,
        _minedGem.weight,
        _minedGem.height,
        _minedGem.width,
        _minedGem.price,
        _minedGem.miningLocation,
        _minedGem.miningYear,
        _minedGem.selected,
        _minedGem.extractionMethod,
        _minedGem.owner,
        true
    );
}

/*
     function processingGem(uint _id) public payable{
        MinedGem memory _minedGem = minedGems[_id];
        address payable _miner = _minedGem.owner;
    require(_minedGem.id > 0 && _minedGem.id <= minedGemCount);
    require(msg.value >= _minedGem.price); //???????? todo????
    require(_minedGem.purchased == false);
       // require(_miner != msg.sender);
        _minedGem.owner = msg.sender;
        _minedGem.purchased = true;
        minedGems[_id] = _minedGem;
        address(_miner).transfer(msg.value);
         emit GemPurchased(minedGemCount, _minedGem.gemType, _minedGem.weight,  _minedGem.height,  _minedGem.width, _minedGem.price, _minedGem.miningLocation,  _minedGem.miningYear, true, _minedGem.extractionMethod, msg.sender,  _minedGem.purchased);
    }
    
*/
    function markGemAsSelected(uint _id) public {
    // Itt ellenőrizd, hogy a hívó személy jogosult-e az állapot frissítésére
    minedGems[_id].selected = true;
}




}