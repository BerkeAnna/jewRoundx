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
        string size; // x x y xz
        uint price; 
        string miningLocation;
        uint miningYear;
       // uint miningMonth;
        bool selected;
        address payable owner;
        string fileURL;
        bool purchased;
    
    }

    event GemMining(
       uint id,
        string gemType,
        uint weight,
        string size,
        uint price, 
        string miningLocation,
        uint miningYear,
         bool selected,
        address payable owner,
        string fileURL,
        bool purchased
    );

     event GemPurchasing(
       uint id,
        string gemType,
        uint weight,
        string size,
        uint price, 
        string miningLocation,
        uint miningYear,
         bool selected,
        address payable owner,
        string fileURL,
        bool purchased
     );

       event GemPurchased(
        uint id,
        string gemType,
        uint weight,
        string size,
        uint price, 
        string miningLocation,
        uint miningYear,
         bool selected,
        address payable owner,
        string fileURL,
        bool purchased
    );
    
     event GemSelected(
        uint id,
        string gemType,
        uint weight,
        string size,
        uint price, 
        string miningLocation,
        uint miningYear,
         bool selected,
        address payable owner,
        string fileURL,
        bool purchased
    );
    

    constructor() public  {
        name = "x";
    }
  function gemMining(
    string memory _gemType, 
    uint _weight, 
    string memory _size,  
    uint _price, 
    string memory _miningLocation, 
    uint _miningYear, 
    string memory _fileURL,  
    bool _purchased
) public {
    require(bytes(_gemType).length > 0, "Gem type cannot be empty");
    require(bytes(_size).length > 0, "Size cannot be empty");
    require(_price > 0, "Price must be greater than 0");
    require(_miningYear > 0, "Mining year must be greater than 0");
    require(bytes(_miningLocation).length > 0, "Mining location cannot be empty");

    minedGemCount++;
    minedGems[minedGemCount] = MinedGem(minedGemCount, _gemType, _weight, _size, _price, _miningLocation, _miningYear, false, msg.sender, _fileURL, _purchased);

    emit GemMining(minedGemCount, _gemType, _weight, _size, _price, _miningLocation, _miningYear, false, msg.sender, _fileURL, _purchased);
}


    function purchaseGem(uint _id) public payable{
        MinedGem memory _minedGem = minedGems[_id];
        address payable _miner = _minedGem.owner;
        require(_minedGem.id > 0 && _minedGem.id <= minedGemCount);
        require(msg.value >= _minedGem.price);
        require(_minedGem.purchased == false);
       // require(_miner != msg.sender);
        _minedGem.owner = msg.sender;
        _minedGem.purchased = true;
        minedGems[_id] = _minedGem;
        address(_miner).transfer(msg.value);
      emit GemPurchased(minedGemCount, _minedGem.gemType, _minedGem.weight,  _minedGem.size, _minedGem.price, _minedGem.miningLocation,  _minedGem.miningYear,  false, msg.sender, _minedGem.fileURL,  _minedGem.purchased);
    }

    function processingGem(uint _id) public {
    MinedGem storage _minedGem = minedGems[_id];
    require(_minedGem.id > 0 && _minedGem.id <= minedGemCount, "Invalid gem ID");
    require(_minedGem.purchased == true, "Gem must be purchased before processing");
    require(_minedGem.selected == false, "Gem is already processed or selected");

    _minedGem.selected = true; // Esetlegesen másik állapotot kellene itt bevezetni, ha a 'selected' nem felel meg.

    emit GemPurchased(_id, _minedGem.gemType, _minedGem.weight, _minedGem.size, _minedGem.price, _minedGem.miningLocation, _minedGem.miningYear, true, _minedGem.owner, _minedGem.fileURL, _minedGem.purchased);
}

    function markGemAsSelected(uint _id) public payable {
    MinedGem storage _minedGem = minedGems[_id];
    require(_minedGem.id > 0 && _minedGem.id <= minedGemCount, "Invalid gem ID");
    require(_minedGem.selected == false, "Gem already selected");
    require(_minedGem.purchased == true, "Gem must be purchased before selection");
    require(msg.value >= _minedGem.price, "Insufficient funds");

    //address payable _seller = _minedGem.owner;
    _minedGem.owner.transfer(msg.value);

    _minedGem.selected = true;

    emit GemSelected(_id, _minedGem.gemType, _minedGem.weight, _minedGem.size, _minedGem.price, _minedGem.miningLocation, _minedGem.miningYear, true, msg.sender, _minedGem.fileURL, _minedGem.purchased);
}


}
