pragma solidity >=0.4.21 <0.6.0;

contract GemstoneSelecting {
    
    uint public selectedGemCount = 0;
    mapping (uint => SelectedGem) public selectedGems;

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
        address owner
     );

        // a minedGemId majd a js-sel kerül át. Kattintás után
      function gemSelecting(uint _minedGemId, uint _weight, uint _height, uint _width, uint _diameter, uint _carat, string memory _color, string memory _gemtype, bool _polishing, uint _price) public {
       selectedGemCount++;

       selectedGems[selectedGemCount] = SelectedGem(selectedGemCount, _minedGemId, _weight,_height, _width, _diameter, _carat, _color, _gemtype, false, _price, msg.sender);

       emit GemSelecting(selectedGemCount, _minedGemId, _weight, _height, _width, _diameter, _carat, _color, _gemtype, false, _price, msg.sender);
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
        _selectedGem.owner
    );
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