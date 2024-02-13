
2023.12.31.
Ha List of selected gems ben megnyomom a selectgemet, akkor kitöltöm a formot és beírja a List of processing gems-hez is, de az elsőből nem törli

----jav: már alapból mindkettőben kilistázza

Ezt kellene javítani, hogy az egyikből törölje. 
AMiket én töröltem az a notepad: új 19, 20 , 21,22

12:31: 13:18:
kilistázni a selected formmal hozzáaadottakat. 
javítani a selected gem gombot, hogy a extractionmethodban módosítsa a selected boolt true-ra és nyissa meg a selectedformot

2024.01.07. 14:35 :
Kibányászott kő -> process gomb -> List of selected gems listába kerül. Előzőből törlődik.
List of selected gems-ben katt a "select gem" gmbra -> selected form feljön. -> kitöltöm -> HIBÁS RESULTS:
                    1. List of selected gems listában bennemarad a selected gem
                    2. ugyanaz a sor a List of processing gemsné, ami a List of selected gems-ben selected lett, ugyanúgy megjelenik.
                    3. a List of processing gems-ben a selected formmal hozzáadott adatok megjelenennek egy új sorban. (de így igazából 2x szerepel)


2024.01.07. 15:06:
    Most a 2. 2 tábla dupláz, de :
    ![Alt text](image.png)


2024.01.07. 19:46:
    Most ha a második táblában rámegyek a selectgemre, akkor utána ottmarad, de az alsó táblába ez is és egy selected sor is bekerül


2024.01.07. 20:26:
    Most a második táblából törlődik. Egy problem:
        a processinggemsnél kilistézza a "minedgem"-et és a "sleectedgem"-et is két külön sorba.
        ----> ezt kellene megcsinálni hogy vagy minden egy sorban legyen, vagy csak a selected látszódjon, és ha rámegyünk egy details gombra akkor mindent a minedről is 

        
2024.01.07. 21:07:
    Most a 3. táblában csak a selectedformosokat jelzi. És törli az előzőkből. Ez jó.
    Todo:
        - a processing gems végére a polishing gomb használata után egy details gomb, ahol összeköti a minedgemet a selectedgem adatokkal és kilistázza az összeset egy oldalon.
        - többihez is details?
        - ékszeres contract

2024.1.12. 20:22
        - detail gomb megjelenik a polishing helyett, ha megvolt a polishing. A details gomb még nem működik.
        - ezek továbbra is todo:
              - a processing gems végére a polishing gomb használata után egy details gomb, ahol összeköti a minedgemet a selectedgem adatokkal és kilistázza az összeset egy oldalon.
                - többihez is details?
                - ékszeres contract


2024.01.23. 10:55
        - ékszeres contract
        - sell gomb -> drágakőpiacra kikerül a kő
        - 

2024.01.26. 13:22
        - nem kell sell gomb. Auto kikerül a piacra, a sell gomb helyett making -> ürlap-> új ékszer

2024.01.26. 14:19
        - jewelry form átírása

2024.01.26. 18:32
        - jewelry form után a own mined gems oldalon a listázásba új tábla, előzőből törlés


2024.01.27. 19:24.
        - jewelry táblában gombokat megcsinálni

2024.01.27. 20:02.
        - list of proc. gems-nél sell gomb -> gem piac --- nooo nem kell sell gomb, alapból kikerül
        - list of jew. sorokban sell gomb -> jew. piac --- nooo nem kell sell gomb, alapból kikerül
        - contractokba require-k, amik ellenőrzik, hogy pl a sleected gem mérete nem lehet nagyobb a minedgemnél
        ![Alt text](image-1.png)
        -gem market buy gomb nem jó, gondolom az owner miatt
        ![Alt text](image-2.png)

2024.01.28. 20:45:
        - a data of jew a detailsen belül a jewmarketben nem ír semmit. miért?
        --- most az a problem, hogy a detailsnál csak azokat listázza ki amit a user adott meg, mást nem


2024.01.28. 21:41:
        - most ha betöltöd a http://localhost:3000/ oldalt nincs navbar, ha a Login gombra mész akkor rá kell frissíteni, hogy 
                látszódjn a navbar. És ha visszalépsz akkor is h eltűnjkön

2024.01.29. 9:19:
        - navbar még minding

2024.02.02. 8:49:
        -problem: ha a selectingnél rossz adatot adunk meg, akkor ha kilép a formból már nem tujuk használni, mert már a selectgem gombbal eltűntetjük  
        - és nem működik a form - jrpc errort kapok, valami nem jó, hiába adok kisebb, nagyobb, egyenlő értéket. meg kell keresni a problemet, de azért ezeket is újra ellenőrizni. a remixen elvileg működik

        skálázható mérés

2024.02.07. 10:26:
        - gemtype nem változik, szóval nem kell megadni a formban, hanem csak vigye tovább
        - megcserélni a selectgemnél a gombokat, előszőr menjen a form, utána a "törlés", mert így ha rosszul adom meg a formban az adatokat és kilépek, a minedgem eltűnik, de már nem tudom selectelni
        - jew.sol-ban a price - require
        - a minedgem.sol-ban require -> hogy nagyobb legyenek, mint 0 az értékek :D

2024.02.09. 9:04:<br>
        - ~~gemtype nem változik, szóval nem kell megadni a formban, hanem csak vigye tovább~~ használom tovább még <br>
        - megcserélni a selectgemnél a gombokat, előszőr menjen a form, utána a "törlés", mert így ha rosszul adom meg a formban az adatokat és kilépek, a minedgem eltűnik, de már nem tudom selectelni<br>
        - ~~a minedgem.sol-ban require -> hogy nagyobb legyenek, mint 0 az értékek :D~~<br>
        - a marketben a buy gomb is kell<br>
        - ~~táblákban a mértékegységek~~<br>
        - gem marketet is megcsinálni, hogy látszódjanak az eladó kövek<br>
        - ~~megcsinálni egy lekérőt, ami id alapján úgyanúgy kilistázza az adatokat - külön ékszerre fix,~~ de lehet kőre is kell a gem market miatt??<br>
        - problem: a ownedbyuser - >List of processing gems details csak azt listázza ki amit a userhez lehet kötin, user adott hozzá. de ez már a marketnél meg van oldva
        - ha más sorrendben csinálom a kövek feldolgozását átírja az összes id-t. PL ha a minedgem 9-es id, de a jewnél 2-est kap, akkor minedt átírja <br><br>

2024.02.12. 9:30:<br>
        - IPFS

2024.02.13. 11:49:
        - gem markastben nem látszik semmi, de a belső gemlist jó
        - https://www.youtube.com/watch?v=SkMH0WeRYtg  20:26 
