pragma solidity >=0.4.21 <0.6.0;

interface IGemstoneExtraction {
    function minedGems(uint) external view returns (uint id, string memory gemType, uint weight, uint height, uint width, uint price, string memory miningLocation, uint miningYear, bool selected, string memory extractionMethod, address payable owner, bool purchased);
}

contract GemstoneSelecting {
    uint public selectedGemCount = 0;
    mapping (uint => SelectedGem) private selectedGems;
    IGemstoneExtraction gemstoneExtraction;
    mapping(uint => bool) public selectedMinedGems;

    struct GemDetails {
        string size;
        uint carat;
        string colorGemType; // Combined color and gem type
    }

    struct SelectedGem {
        uint id;
        uint minedGemId;
        uint previousGemId;
        GemDetails details;
        bool forSale;
        string fileURL;
        uint price;
        bool used;
        address owner;
        address gemCutter;
    }

    event GemSelecting(
        uint id,
        uint minedGemId,
        string size,
        uint carat,
        string colorGemType, // Combined color and gem type
        bool forSale,
        string fileURL,
        uint price,
        bool used,
        address owner,
        address gemCutter
    );

    constructor(address _gemstoneExtractionAddress) public {
        gemstoneExtraction = IGemstoneExtraction(_gemstoneExtractionAddress);
    }

    function setPreviousGemId(uint gemId, uint previousGemId) public {
        SelectedGem storage gem = selectedGems[gemId];
        require(gem.id > 0, "Gem does not exist.");
        gem.previousGemId = previousGemId;
    }

    function gemSelecting(
        uint _minedGemId,
        string memory _size,
        uint _carat,
        string memory _colorGemType, // Combined color and gem type
        string memory _fileURL,
        uint _price
    ) public {
        selectedGemCount++;
        SelectedGem storage gem = selectedGems[_minedGemId];
        gem.id = _minedGemId;
        gem.minedGemId = _minedGemId;
        gem.details = GemDetails({
            size: _size,
            carat: _carat,
            colorGemType: _colorGemType // Combined color and gem type
        });
        gem.forSale = false;
        gem.fileURL = _fileURL;
        gem.price = _price;
        gem.used = false;
        gem.owner = msg.sender;
        gem.gemCutter = msg.sender;

        emit GemSelecting(
            gem.id,
            gem.minedGemId,
            gem.details.size,
            gem.details.carat,
            gem.details.colorGemType, // Combined color and gem type
            gem.forSale,
            gem.fileURL,
            gem.price,
            gem.used,
            gem.owner,
            gem.gemCutter
        );
    }

    function polishGem(uint _id) public payable {
        SelectedGem storage _selectedGem = selectedGems[_id];
        _selectedGem.forSale = !_selectedGem.forSale;

        emit GemSelecting(
            _selectedGem.id,
            _selectedGem.minedGemId,
            _selectedGem.details.size,
            _selectedGem.details.carat,
            _selectedGem.details.colorGemType, // Combined color and gem type
            _selectedGem.forSale,
            _selectedGem.fileURL,
            _selectedGem.price,
            _selectedGem.used,
            _selectedGem.owner,
            _selectedGem.gemCutter
        );
    }

    function markGemAsUsed(uint _id) public {
        SelectedGem storage _selectedGem = selectedGems[_id];
        require(_selectedGem.id > 0 && _selectedGem.id <= selectedGemCount, "Invalid gem ID");
        require(_selectedGem.used == false, "Gem already used");
        _selectedGem.used = true;

        emit GemSelecting(
            _id,
            _selectedGem.minedGemId,
            _selectedGem.details.size,
            _selectedGem.details.carat,
            _selectedGem.details.colorGemType, // Combined color and gem type
            _selectedGem.forSale,
            _selectedGem.fileURL,
            _selectedGem.price,
            _selectedGem.used,
            _selectedGem.owner,
            _selectedGem.gemCutter
        );
    }

    function getSelectedGemsCountByOwner(address _owner) public view returns (uint) {
        uint count = 0;
        for (uint i = 1; i <= selectedGemCount; i++) {
            if (selectedGems[i].owner == _owner) {
                count++;
            }
        }
        return count;
    }

    function transferGemOwnership(uint _id) public {
        SelectedGem storage _selectedGem = selectedGems[_id];
        require(_selectedGem.id > 0 && _selectedGem.id <= selectedGemCount, "Invalid gem ID");
        require(_selectedGem.owner != msg.sender, "You already own this gem");

        _selectedGem.owner = msg.sender;
        _selectedGem.forSale = false;

        emit GemSelecting(
            _selectedGem.id,
            _selectedGem.minedGemId,
            _selectedGem.details.size,
            _selectedGem.details.carat,
            _selectedGem.details.colorGemType, // Combined color and gem type
            _selectedGem.forSale,
            _selectedGem.fileURL,
            _selectedGem.price,
            _selectedGem.used,
            _selectedGem.owner,
            _selectedGem.gemCutter
        );
    }

    // Public getter for selectedGems
    function getSelectedGem(uint _id) public view returns (
        uint id,
        uint minedGemId,
        uint previousGemId,
        string memory size,
        uint carat,
        string memory colorGemType, // Combined color and gem type
        bool forSale,
        string memory fileURL,
        uint price,
        bool used,
        address owner,
        address gemCutter
    ) {
        SelectedGem storage gem = selectedGems[_id];
        return (
            gem.id,
            gem.minedGemId,
            gem.previousGemId,
            gem.details.size,
            gem.details.carat,
            gem.details.colorGemType, // Combined color and gem type
            gem.forSale,
            gem.fileURL,
            gem.price,
            gem.used,
            gem.owner,
            gem.gemCutter
        );
    }

    function getGemDetails(uint _id) public view returns (
        uint id,
        uint minedGemId,
        uint previousGemId,
        string memory size,
        uint carat,
        string memory colorGemType,
        bool forSale,
        string memory fileURL,
        uint price,
        bool used,
        address owner,
        address gemCutter
    ) {
        return getSelectedGem(_id);
    }
}
