pragma solidity >=0.4.21 <0.6.0;
import "./GemstoneExtraction.sol";

interface IGemstoneExtraction {
    function minedGems(uint) external view returns (uint id, string memory gemType, uint weight, uint height, uint width, uint price, string memory miningLocation, uint miningYear, bool selected, string memory extractionMethod, address payable owner, bool purchased);
}

contract GemstoneSelecting {
    uint public selectedGemCount = 0;
    mapping (uint => SelectedGem) public selectedGems;
    IGemstoneExtraction gemstoneExtraction;
    mapping(uint => bool) public selectedMinedGems;

    struct SelectedGem {
        uint id;
        uint minedGemId;
        string size;
        uint carat;
        string color;
        string gemType;
        bool polishing;
        string fileURL;
        uint price;
        bool used;
        address owner;
    }

    event GemSelecting(
        uint id,
        uint minedGemId,
        string size,
        uint carat,
        string color,
        string gemType,
        bool polishing,
        string fileURL,
        uint price,
        bool used,
        address owner
    );

    constructor(address _gemstoneExtractionAddress) public {
        gemstoneExtraction = IGemstoneExtraction(_gemstoneExtractionAddress);
    }

    function gemSelecting(
        uint _minedGemId,
        string memory _size,
        uint _carat,
        string memory _color,
        string memory _gemtype,
        bool _polishing,
        string memory _fileURL,
        uint _price
    ) public {
        selectedGemCount++;
        selectedGems[_minedGemId] = SelectedGem(
            _minedGemId,
            _minedGemId,
            _size,
            _carat,
            _color,
            _gemtype,
            _polishing,
            _fileURL,
            _price,
            false,
            msg.sender
        );

        emit GemSelecting(
            _minedGemId,
            _minedGemId,
            _size,
            _carat,
            _color,
            _gemtype,
            _polishing,
            _fileURL,
            _price,
            false,
            msg.sender
        );
    }

    function polishGem(uint _id) public payable {
        SelectedGem storage _selectedGem = selectedGems[_id];
        require(_selectedGem.owner == msg.sender, "Caller is not the owner");
        _selectedGem.polishing = true;

        emit GemSelecting(
            _selectedGem.id, 
            _selectedGem.minedGemId, 
            _selectedGem.size,
            _selectedGem.carat, 
            _selectedGem.color, 
            _selectedGem.gemType, 
            true, 
            _selectedGem.fileURL,
            _selectedGem.price, 
            false,
            _selectedGem.owner
        );
    }

    function markGemAsUsed(uint _id) public {
        SelectedGem storage _selectedGem = selectedGems[_id];
        require(_selectedGem.id > 0 && _selectedGem.id <= selectedGemCount, "Invalid gem ID");
        require(_selectedGem.used == false, "Gem already used");
        _selectedGem.used = true;

        emit GemSelecting(_id, _selectedGem.minedGemId, _selectedGem.size, _selectedGem.carat,  _selectedGem.color, _selectedGem.gemType, true,_selectedGem.fileURL, _selectedGem.price, _selectedGem.used, msg.sender);
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
}
