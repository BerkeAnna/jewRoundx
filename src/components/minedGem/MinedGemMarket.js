import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Market.css';

function MinedGemMarket({ minedGems, account, markNewOwner, }) {
  const navigate = useNavigate();
  const ownedMinedGems = minedGems.filter(minedGem => minedGem.owner !== account);
  const [pinataMetadataMined, setPinataMetadataMined] = useState({}); // Minden gem metaadatait objektumban tároljuk

  const handleMarkAsSelected = (gemId, price) => {
    markNewOwner(gemId, price);
  };

  // Pinata metaadatok lekérése egy adott gem ID alapján
  const fetchPinataMetadataMined = async (hash, gemId) => {
    try {
      const cleanedHash = cleanHash(hash);
      const url = cleanedHash;
      const response = await fetch(url);
      const data = await response.json();
      setPinataMetadataMined(prevState => ({
        ...prevState,
        [gemId]: data // Metaadatok mentése gem ID szerint
      }));
    } catch (error) {
      //console.error('Error fetching Pinata metadata:', error);
    }
  };

  const cleanHash = (hash) => {
    if (hash.startsWith('https://gateway.pinata.cloud/ipfs/')) {
      return hash.replace('https://gateway.pinata.cloud/ipfs/', '');
    }
    return hash;
  };

  // useEffect a metaadatok lekérésére minden bányászott gem-hez
  useEffect(() => {
    ownedMinedGems.forEach((gem) => {
      if (gem.metadataHash) {
        fetchPinataMetadataMined(gem.metadataHash, gem.id); // Lekérés gem ID szerint
      }
    });
  }, [ownedMinedGems]);

  const renderMinedGems = () => {
    return ownedMinedGems.map((minedGem, key) => (
      minedGem.purchased === true && minedGem.selected === false && (
      <div key={key} className="card market-card">
         {minedGem.fileURL && (
          <a href={minedGem.fileURL} target="_blank" rel="noopener noreferrer">
            <img src={minedGem.fileURL} alt="Gem image" className="details-image" />
          </a>
        )}
          
        <p><strong>ID:</strong> {minedGem.id.toString()}</p>
        <p><strong> {minedGem.gemType}</strong></p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Miner:</strong> {minedGem.miner}</p>
        <p><strong>Owner:</strong> {minedGem.owner}</p>
        <button className="btn" onClick={() => handleMarkAsSelected(minedGem.id, minedGem.price)}>
          Buy
        </button>
        <button className="btn" onClick={() => navigate(`/gem-details/${minedGem.id}`)}>
          Details
        </button>
      </div>
    )));
  };

  return (
    <div className="gem-market card-background">
      <p>&nbsp;</p>
      <h2>Mined Gem market</h2>
      <div className="gem-cards">
        {renderMinedGems()}
      </div>
      <div className="homeButton">
        <button onClick={() => navigate(`/loggedIn`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default MinedGemMarket;
