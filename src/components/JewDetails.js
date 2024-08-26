import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function JewDetails({ selectedGems, minedGems, jewelry, account, jewelryContract }) {
  const { id } = useParams();
  const gemId = id;

  const gemSelected = selectedGems.filter(gem => gem.owner && gem.id == gemId);
  const minedGem = minedGems.filter(gem => gem.owner && gem.id == gemId);
  const jewelryDetails = jewelry.filter(item => item.id == gemId);

  const [prevGemsArray, setPrevGemsArray] = useState([]);
  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const details = await jewelryContract.methods.getJewelryDetails(id).call();
  
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId.toString(), 10));
        setPrevGemsArray(gemIdsAsInt);
  
        console.log("Jewelry Details:", details);
  
        // Események lekérése
        const events = await jewelryContract.getPastEvents('allEvents', {
          fromBlock: 0, // Minden blokkot lekérünk
          toBlock: 'latest'
        });
  
        // Események szűrése az adott ékszer vagy gem id-ja alapján
        const filteredEvents = events.filter(event => {
          const returnValues = event.returnValues;
          return parseInt(returnValues.id) === parseInt(id);
        });
  
        console.log("Filtered Jewelry and Gem Transaction Events:", filteredEvents);
  
      } catch (error) {
        console.error("Error fetching jewelry details:", error);
      }
    };
  
    fetchJewelryDetails();
  }, [id, jewelryContract]);
  
  /*//ez minden tranzakciót listáz
  useEffect(() => {
    const fetchJewelryDetails = async () => {
      
      try {
        const details = await jewelryContract.methods.getJewelryDetails(id).call();
  
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId.toString(), 10));
        setPrevGemsArray(gemIdsAsInt);
  
        console.log("Jewelry Details:", details);
        
        // Események lekérése
        /*A getPastEvents metódus a Web3.js könyvtár része, és lehetővé teszi, hogy lekérj eseményeket (events) 
        egy okos szerződésből a blokkláncról. Ez a metódus nem korlátozódik arra, hogy csak az aktuálisan megjelenített 
        oldalon lévő tranzakciókat listázza, hanem az összes olyan eseményt, amely megfelel a megadott szűrőknek és paramétereknek.
        */
      /*  const events = await jewelryContract.getPastEvents('allEvents', {
          fromBlock: 0, // Minden blokkot lekérünk
          toBlock: 'latest'
        });
        
        console.log("All Jewelry Transaction Events:", events);
        
        
      } catch (error) {
        console.error("Error fetching jewelry details:", error);
      }
    };
  
    fetchJewelryDetails();
  }, [id, jewelryContract]);
  */

  const cardStyle = {
    marginBottom: '20px', // Növelt margó a kártyák között
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#FFF7F3',
    width: '80%',
    margin: 'auto',
    textAlign: 'center',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
  };

  const renderSelectedGems = () => {
    const filteredSelectedGems = selectedGems.filter(gem => prevGemsArray.includes(parseInt(gem.id, 10)));

    return filteredSelectedGems.map((gem, key) => (
      <div key={key} className="card" style={cardStyle}>
        <h2>Selected Gem Details</h2>
        {gem.fileURL && (
          <div>
            <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={gem.fileURL} alt="Feltöltött kép" style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '20px' }} />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {gem.id.toString()}</p>
        <p><strong>Size:</strong> {gem.size.toString()} mm</p>
        <p><strong>Carat:</strong> {gem.carat.toString()} ct</p>
        <p><strong>Color and gem type:</strong> {gem.colorGemType}</p>
        <p><strong>forSale:</strong> {gem.forSale.toString()}</p>
        <p><strong>Used:</strong> {gem.used.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Gem cutter:</strong> {gem.gemCutter}</p>
        <p><strong>Owner:</strong> {gem.owner}</p>
        <p><strong>previousGemId:</strong> {gem.previousGemId.toString()}</p>
      </div>
    ));
  };

  const renderMinedGems = () => {
    const filteredMinedGems = minedGems.filter(gem => prevGemsArray.includes(parseInt(gem.id, 10)));

    return filteredMinedGems.map((gem, key) => (
      <div key={key} className="card" style={cardStyle}>
        <h2>Mined Gem Details</h2>
        {gem.fileURL && (
          <div>
            <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={gem.fileURL} alt="Feltöltött kép" style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '20px' }} />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {gem.id.toString()}</p>
        <p><strong>Type:</strong> {gem.gemType}</p>
        <p><strong>Weight:</strong> {gem.weight.toString()} mm</p>
        <p><strong>Size:</strong> {gem.size.toString()} mm</p>
        <p><strong>Mining Location:</strong> {gem.miningLocation}</p>
        <p><strong>Mining Year:</strong> {gem.miningYear.toString()}</p>
        <p><strong>Extraction Method:</strong> {gem.extractionMethod}</p>
        <p><strong>Selected:</strong> {gem.selected.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Miner:</strong> {gem.owner}</p>
      </div>
    ));
  };

  const renderJewelry = () => {
    return jewelryDetails.map((jewelry, key) => (
      <div key={key} className="card" style={cardStyle}>
        <h2>Jewelry Details</h2>
        {jewelry.fileURL && (
          <div>
            <a href={jewelry.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={jewelry.fileURL} alt="Jewelry" style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '20px' }} />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {jewelry.id.toString()}</p>
        <p><strong>Name:</strong> {jewelry.name}</p>
        <p><strong>Metal:</strong> {jewelry.metal}</p>
        <p><strong>Details:</strong> {jewelry.physicalDetails.toString()} mm</p>
        <p><strong>Sale:</strong> {jewelry.sale.toString()}</p>
        <p><strong>Processing:</strong> {jewelry.processing.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(jewelry.price.toString(), 'Ether')} Eth</p>
        <p><strong>Jeweler:</strong> {jewelry.jeweler}</p>
        <p><strong>Owner:</strong> {jewelry.owner}</p>
      </div>
    ));
  };

  const renderPreviousGems = () => {
    return jewelryDetails.map((jewelry, key) => {
      if (!jewelry.previousGemIds) return null; // Handle undefined previousGemIds
      return jewelry.previousGemIds.map((gemId, subKey) => {
        const previousGem = selectedGems.find(gem => gem.id === gemId);
        if (!previousGem) return null;

        return (
          <div key={`${key}-${subKey}`} className="card" style={cardStyle}>
            <h2>Previous Selected Gem Details</h2>
            {previousGem.fileURL && (
              <div>
                <a href={previousGem.fileURL} target="_blank" rel="noopener noreferrer">
                  <img src={previousGem.fileURL} alt="Feltöltött kép" style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '20px' }} />
                </a>
              </div>
            )}
            <p><strong>ID:</strong> {previousGem.id.toString()}</p>
            <p><strong>Size:</strong> {previousGem.size.toString()} mm</p>
            <p><strong>Carat:</strong> {previousGem.carat.toString()} ct</p>
            <p><strong>Color:</strong> {previousGem.color}</p>
            <p><strong>Gem Type:</strong> {previousGem.gemType}</p>
            <p><strong>forSale:</strong> {previousGem.forSale.toString()}</p>
            <p><strong>Used:</strong> {previousGem.used.toString()}</p>
            <p><strong>Price:</strong> {window.web3.utils.fromWei(previousGem.price.toString(), 'Ether')} Eth</p>
            <p><strong>Gem cutter:</strong> {previousGem.owner}</p>
          </div>
        );
      });
    });
  };

  return (
    <div className="pt-5" style={{ maxWidth: '1200px', margin: 'auto' }}>
      <h1>Gem Details</h1>
      <div className="pt-5">
        {renderMinedGems()}
      </div>
      <div className="pt-5">
        {renderSelectedGems()}
      </div>
      <div className="pt-5">
        {renderJewelry()}
      </div>
      <div className="pt-5">
        {renderPreviousGems()}
      </div>
    </div>
  );
}

export default JewDetails;
