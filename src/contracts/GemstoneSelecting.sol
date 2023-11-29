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
        string grinding;
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
        string grinding,
        uint price,
        address owner
     );

        // a minedGemId majd a js-sel kerül át. Kattintás után
      function gemSelecting(uint _minedGemId, uint _weight, uint _height, uint _width, uint _diameter, uint _carat, string memory _color, string memory _gemtype, string memory _grinding, uint _price) public {
       selectedGemCount++;

       selectedGems[selectedGemCount] = SelectedGem(selectedGemCount, _minedGemId, _weight,_height, _width, _diameter, _carat, _color, _gemtype, _grinding, _price, msg.sender);

       emit GemSelecting(selectedGemCount, _minedGemId, _weight, _height, _width, _diameter, _carat, _color, _gemtype, _grinding, _price, msg.sender);
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