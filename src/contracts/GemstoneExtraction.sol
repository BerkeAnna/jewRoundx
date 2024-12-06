pragma solidity >=0.4.21 <0.6.0;

contract GemstoneExtraction {
    string public name;
    uint public minedGemCount = 0;

    mapping(uint => MinedGem) public minedGems;

    enum PointOfProcessing {MINED, SALEOFMINEDPRODUCT, PREPARATION, PROCESSING}

    struct MinedGem {
        uint id;
        string gemType;
        string details;
        uint price;
        string miningLocation;
        uint miningYear;
        bool selected;
        address payable miner; // A kibányászó személy
        address payable owner; // Az új tulajdonos
        string fileURL;
        bool purchased;
    }

    event GemMining(
        uint id,
        string gemType,
        string details,
        uint price,
        string miningLocation,
        uint miningYear,
        bool selected,
        address payable miner,
        address payable owner,
        string fileURL,
        bool purchased
    );

    event GemProcessing(
        uint id,
        address payable miner,
        address payable owner
    );

    event GemSale(
        uint id,
        address payable miner,
        address payable owner
    );

    event GemSelected(
        uint id,
        address payable miner,
        address payable owner
    );

     event MarkNewOwner(
        uint id,
        address payable miner,
        address payable owner
    );
     event MarkGemAsSelected(
        uint id,
        address payable miner,
        address payable owner
    );

    event TransferGemOwnership(
        uint id,
        address payable miner,
        address payable owner
    );

    constructor() public {
        name = "x";
    }

    function gemMining(
        string memory _gemType,
        string memory _details,
        uint _price,
        string memory _miningLocation,
        uint _miningYear,
        string memory _fileURL,
        bool _purchased
    ) public {
        require(bytes(_gemType).length > 0, "Gem type cannot be empty");
        require(bytes(_details).length > 0, "details cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        require(_miningYear > 0, "Mining year must be greater than 0");
        require(bytes(_miningLocation).length > 0, "Mining location cannot be empty");

        minedGemCount++;
        minedGems[minedGemCount] = MinedGem(
            minedGemCount,
            _gemType,
            _details,
            _price,
            _miningLocation,
            _miningYear,
            false,
            msg.sender, // Miner lesz az eredeti tulajdonos
            msg.sender, // Az új tulajdonos még nincs meghatározva
            _fileURL,
            _purchased
        );

        emit GemMining(minedGemCount, _gemType, _details, _price, _miningLocation, _miningYear, false, msg.sender, msg.sender, _fileURL, _purchased);
    }

    function purchaseGem(uint _id) public payable {
        MinedGem storage _minedGem = minedGems[_id];
        require(_minedGem.id > 0 && _minedGem.id <= minedGemCount);
        require(_minedGem.purchased == false);

        _minedGem.owner = msg.sender; // Az új tulajdonos beállítása
        _minedGem.purchased = true;

        emit GemSale(_id, _minedGem.miner, msg.sender);
    }

    function processingGem(uint _id) public {
        MinedGem storage _minedGem = minedGems[_id];
        require(_minedGem.id > 0 && _minedGem.id <= minedGemCount, "Invalid gem ID");
        require(_minedGem.purchased == true, "Gem must be purchased before processing");
        require(_minedGem.selected == false, "Gem is already processed or selected");

        _minedGem.selected = true;

        emit GemProcessing(_id, _minedGem.miner, _minedGem.owner);
    }

    function markNewOwner(uint _id) public payable {
        MinedGem storage _minedGem = minedGems[_id];
        require(_minedGem.id > 0 && _minedGem.id <= minedGemCount, "Invalid gem ID");
        require(_minedGem.selected == false, "Gem already selected");
        require(_minedGem.purchased == true, "Gem must be purchased before selection");
        require(msg.value >= _minedGem.price, "Insufficient funds");

        _minedGem.miner.transfer(msg.value);

        _minedGem.owner = msg.sender;

        emit MarkNewOwner(_id, _minedGem.miner, _minedGem.owner);
    }

     function markGemAsSelected(uint _id) public payable {
        MinedGem storage _minedGem = minedGems[_id];
        require(_minedGem.id > 0 && _minedGem.id <= minedGemCount, "Invalid gem ID");
        require(_minedGem.selected == false, "Gem already selected");
        require(_minedGem.purchased == true, "Gem must be purchased before selection");


        _minedGem.selected = true;


        emit MarkGemAsSelected(_id, _minedGem.miner, _minedGem.owner);
    }

    function getGemstoneCountByOrder(address _owner) public view returns (uint) {
        uint count = 0;
        for (uint i = 1; i <= minedGemCount; i++) {
            if (minedGems[i].owner == _owner) {
                count++;
            }
        }
        return count;
    }
}
