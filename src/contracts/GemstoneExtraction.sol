pragma solidity >=0.4.21 <0.6.0;

contract GemstoneExtraction {
    string public name;
    uint public minedGemCount = 0;

    mapping(uint => MinedGem) public minedGems;

    enum PointOfProcessing {MINED, SALEOFMINEDPRODUCT, PREPARATION, PROCESSING}

    struct MinedGem {
        uint id;
        string gemType;
        uint price;
        address payable miner;
        address payable owner;
        string metadataHash; 
        bool purchased; 
        bool selected;
        string fileURL;
    }

    event GemMining(
        uint id,
        string gemType,
        uint price,
        address payable miner,
        address payable owner,
        string metadataHash,
        bool purchased,
        string fileURL
    );

    event GemProcessing(
        uint id,
        string gemType,
        uint price,
        address payable miner,
        address payable owner,
        string metadataHash,
        bool purchased,
        string fileURL
    );

    event GemPurchased(
        uint id,
        string gemType,
        uint price,
        address payable miner,
        address payable owner,
        string metadataHash,
        bool purchased,
        string fileURL
    );

    event GemSelected(
        uint id,
        string gemType,
        uint price,
        address payable miner,
        address payable owner,
        string metadataHash,
        bool purchased,
        string fileURL
    );

    event MarkNewOwner(
        uint id,
        string gemType,
        uint price,
        address payable miner,
        address payable owner,
        string metadataHash,
        bool purchased,
        string fileURL
    );

    event MarkGemAsSelected(
        uint id,
        string gemType,
        uint price,
        address payable miner,
        address payable owner,
        string metadataHash,
        bool purchased,
        string fileURL
    );

    event TransferGemOwnership(
        uint id,
        string gemType,
        uint price,
        address payable miner,
        address payable owner,
        string metadataHash,
        bool purchased,
        string fileURL
    );

    constructor() public {
        name = "Gemstone Extraction Platform";
    }

    function gemMining(
        string memory _gemType,
        uint _price,
        string memory _metadataHash, 
        bool _purchased,
        string memory _fileURL
    ) public {
        require(bytes(_gemType).length > 0, "Gem type cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_metadataHash).length > 0, "Metadata hash cannot be empty");

        minedGemCount++;
        minedGems[minedGemCount] = MinedGem(
            minedGemCount,
            _gemType,
            _price,
            msg.sender, 
            msg.sender, 
            _metadataHash, 
            _purchased,
            false, // kezdetben nem választották ki
            _fileURL
        );

        emit GemMining(minedGemCount, _gemType, _price, msg.sender, msg.sender, _metadataHash, _purchased, _fileURL);
    }

    function purchaseGem(uint _id) public payable {
        MinedGem storage _minedGem = minedGems[_id];
        require(_minedGem.id > 0 && _minedGem.id <= minedGemCount, "Invalid gem ID");
        require(_minedGem.purchased == false, "Gem already purchased");

        _minedGem.owner = msg.sender; 
        _minedGem.purchased = true;

        emit GemPurchased(_id, _minedGem.gemType, _minedGem.price, _minedGem.miner, msg.sender, _minedGem.metadataHash, _minedGem.purchased, _minedGem.fileURL);
    }

    function processingGem(uint _id) public {
        MinedGem storage _minedGem = minedGems[_id];
        require(_minedGem.id > 0 && _minedGem.id <= minedGemCount, "Invalid gem ID");
        require(_minedGem.purchased == true, "Gem must be purchased before processing");

        emit GemProcessing(_id, _minedGem.gemType, _minedGem.price, _minedGem.miner, _minedGem.owner, _minedGem.metadataHash, _minedGem.purchased, _minedGem.fileURL);
    }

    function markNewOwner(uint _id) public payable {
        MinedGem storage _minedGem = minedGems[_id];

        require(_minedGem.id > 0 && _minedGem.id <= minedGemCount, "Invalid gem ID");
        require(_minedGem.selected == false, "Gem already selected");
        require(_minedGem.purchased == true, "Gem must be purchased before selection");
        require(msg.value >= _minedGem.price, "Insufficient funds");

        _minedGem.miner.transfer(msg.value);

        _minedGem.owner = msg.sender;

        emit MarkNewOwner(
            _id, 
            _minedGem.gemType, 
            _minedGem.price, 
            _minedGem.miner, 
            _minedGem.owner, 
            _minedGem.metadataHash, 
            _minedGem.purchased,
            _minedGem.fileURL
        );
    }

    function markGemAsSelected(uint _id) public {
        MinedGem storage _minedGem = minedGems[_id];

        require(_minedGem.id > 0 && _minedGem.id <= minedGemCount, "Invalid gem ID");
        require(_minedGem.selected == false, "Gem already selected");
        require(_minedGem.purchased == true, "Gem must be purchased before selection");

        _minedGem.selected = true;

        emit MarkGemAsSelected(
            _id, 
            _minedGem.gemType, 
            _minedGem.price, 
            _minedGem.miner, 
            _minedGem.owner, 
            _minedGem.metadataHash, 
            _minedGem.purchased,
            _minedGem.fileURL
        );
    }

    function getGemstoneCountByOwner(address _owner) public view returns (uint) {
        uint count = 0;
        for (uint i = 1; i <= minedGemCount; i++) {
            if (minedGems[i].owner == _owner) {
                count++;
            }
        }
        return count;
    }
}
