pragma solidity >=0.4.21 <0.6.0;
import "./GemstoneExtraction.sol";

interface IGemstoneExtraction {
    function minedGems(uint) external view returns (uint id, string memory gemType, uint weight, uint height, uint width, uint price, string memory miningLocation, uint miningYear, bool selected, string memory extractionMethod, address payable owner, bool purchased);
}



contract GemstoneSelecting {
    
    uint public selectedGemCount = 0;
    mapping (uint => SelectedGem) public selectedGems;
      IGemstoneExtraction gemstoneExtraction;

    struct SelectedGem{
        uint id;
        uint minedGemId;
        uint weight;
        uint height;
        uint width;
        uint diameter; //vastagsag
        uint carat; //==weight A karát a drágakövek tömegének mérésére szolgáló mértékegység. Jele: Kt, angolszász területen ct.
        string color;
        string gemType; //etc gyémánt, rubint, gránit
        bool polishing;
        uint price;
        bool used;
        address owner;
    }

     event GemSelecting(
        uint id,
        uint minedGemId,
        uint weight,
        uint height,
        uint width,
        uint diameter,
        uint carat,
        string color,
        string gemType,
        bool polishing,
        uint price,
        bool used,
        address owner
     );

 constructor(address _gemstoneExtractionAddress) public {
        gemstoneExtraction = IGemstoneExtraction(_gemstoneExtractionAddress);
    }
        // a minedGemId majd a js-sel kerül át. Kattintás után
   // A gemSelecting függvény módosítása a GemstoneSelecting szerződésben
function gemSelecting(
    uint _minedGemId,
    uint _weight,
    uint _height,
    uint _width,
    uint _diameter,
    uint _carat,
    string memory _color,
    string memory _gemtype,
    bool _polishing,
    uint _price
) public {
    // Lekérdezzük a bányászott gyémánt adatait a GemstoneExtraction szerződésből
    (, , uint minedWeight, uint minedHeight, uint minedWidth, , , , bool selected, , , ) = gemstoneExtraction.minedGems(_minedGemId);

    // Ellenőrizzük, hogy a paraméterként átadott súly kisebb-e, mint a bányászott drágakő súlya
    require(_weight < minedWeight, "Selected gem weight must be less than mined gem weight");

    // Ellenőrizzük, hogy a paraméterként átadott adatok megegyeznek-e a lekérdezett adatokkal (magasság és szélesség tekintetében)
    require(minedHeight == _height && minedWidth == _width, "The provided dimensions do not match the mined gem data");

    // Ellenőrizzük, hogy a gyémánt még nincs kiválasztva
   // require(!selected, "The gem is already selected");

    // Folytatjuk a gyémánt hozzáadását, ha minden ellenőrzés sikeres
    selectedGemCount++;
    selectedGems[selectedGemCount] = SelectedGem(
        selectedGemCount,
        _minedGemId,
        _weight,
        _height,
        _width,
        _diameter,
        _carat,
        _color,
        _gemtype,
        _polishing,
        _price,
        false,
        msg.sender
    );

    emit GemSelecting(
        selectedGemCount,
        _minedGemId,
        _weight,
        _height,
        _width,
        _diameter,
        _carat,
        _color,
        _gemtype,
        _polishing,
        _price,
        false,
        msg.sender
    );

    // Itt kellene hozzáadni egy új függvényhívást a GemstoneExtraction szerződéshez, hogy beállítsuk a 'selected' állapotot 'true'-ra
}



     function polishGem(uint _id) public payable {
    SelectedGem storage _selectedGem = selectedGems[_id];
    require(_selectedGem.owner == msg.sender, "Caller is not the owner");

    // További logika a fizetés és a polírozási folyamat kezelésére

    _selectedGem.polishing = true;

    emit GemSelecting(
        _selectedGem.id, 
        _selectedGem.minedGemId, 
        _selectedGem.weight, 
        _selectedGem.height, 
        _selectedGem.width, 
        _selectedGem.diameter, 
        _selectedGem.carat, 
        _selectedGem.color, 
        _selectedGem.gemType, 
        true, 
        _selectedGem.price, 
        false,
        _selectedGem.owner
    );
     }

    function markGemAsUsed(uint _id) public {
        SelectedGem storage _selectedGem = selectedGems[_id];
        require(_selectedGem.id > 0 && _selectedGem.id <= selectedGemCount, "Invalid gem ID");
        require(_selectedGem.used == false, "Gem already used");
        //require(_selectedGem.owner == msg.sender, "Only the owner can select the gem");

        _selectedGem.used = true;

        emit GemSelecting(_id, _selectedGem.minedGemId, _selectedGem.weight,  _selectedGem.height,  _selectedGem.width, _selectedGem.diameter, _selectedGem.carat,  _selectedGem.color, _selectedGem.gemType, true, _selectedGem.price, _selectedGem.used, msg.sender);
    }

//innen úgy kellene tovább menni, hogy kiválogatva ki lesz.
// az itt felvitt adatokkal látszik, hogy feldolgozatlan gyémánt/ rubint/etc
//utána két külön .sol-ban kezelni a gyémántot és a többi drágakövet. (könyvjelzőből drágakőpiac, gyéméntpiac) adataival
//a vágást azokkal a .sol-okkal menti el
//utána a csiszolás, utána a polirozas
//tanusitvány kiadása???
//ékszerész veszi meg -> ékszertervezés
//befejezés , felületkezelés
//minőségellenőrzés 
}