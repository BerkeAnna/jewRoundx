import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function GemMarket({  selectedGems, transferGemOwnership }) {
  const navigate = useNavigate();
  const gemsSale = selectedGems.filter(gem => gem.forSale);

  const [pinataMetadataSelected, setPinataMetadataSelected] = useState({}); // Metaadatok a kiválasztott kövekhez
  
  // Pinata metaadatok lekérése
  const fetchPinataMetadataForSelected = async (hash, gemId) => {
    try {
      const cleanedHash = cleanHash(hash);
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setPinataMetadataSelected(prevState => ({
        ...prevState,
        [gemId]: data
      }));
    } catch (error) {
      console.error('Error fetching Pinata metadata for selected gems:', error);
    }
  };

  const cleanHash = (hash) => {
    if (hash.startsWith('https://gateway.pinata.cloud/ipfs/')) {
      return hash.replace('https://gateway.pinata.cloud/ipfs/', '');
    }
    return hash;
  };

  useEffect(() => {
    gemsSale.forEach((gem) => {
      if (gem.metadataHash) {
        fetchPinataMetadataForSelected(gem.metadataHash, gem.id);
      }
    });
  }, [gemsSale]);

  const handleMarkAsSelected = (gemId, price) => {
    transferGemOwnership(gemId, price);
  };

  const renderGemsSale = () => {
    return gemsSale.map((gem, key) => (
      <div key={key} className="card market-card">
        <img src={gem.fileURL} className="card-img-top card-img-top-market"  />
        <div className="card-body">
          <h5 className="card-title">{gem.gemType}</h5>
          <p className="card-text">Price: {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
          <p className="card-text">Owner: {gem.owner}</p>
          <button className="btn" onClick={() => handleMarkAsSelected(gem.id, gem.price)}>
            Buy
          </button>
          <button className="btn" onClick={() => navigate(`/gem-details/${gem.id}`)}>
            Details
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="gem-market card-background">
      <p>&nbsp;</p>
      <h2>Gem market</h2>
      <div className="gem-cards">
        {renderGemsSale()}
      </div>
      <div className='homeButton'>
        <button onClick={() => navigate(`/loggedIn`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default GemMarket;