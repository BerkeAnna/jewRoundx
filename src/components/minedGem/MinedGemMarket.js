import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Market.css';
import { ethers } from 'ethers';

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
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setPinataMetadataMined(prevState => ({
        ...prevState,
        [gemId]: data // Metaadatok mentése gem ID szerint
      }));
    } catch (error) {
      console.error('Error fetching Pinata metadata:', error);
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
         <img src={minedGem.fileURL} className="card-img-top" alt={`${minedGem.gemType}`} />
        <p><strong>ID:</strong> {minedGem.id.toString()}</p>
        <p><strong>Price: </strong>{ethers.utils.formatEther(ethers.BigNumber.from(Math.floor(minedGem.price).toString()))} Eth</p> {/* BigNumber konverzió */}
         
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