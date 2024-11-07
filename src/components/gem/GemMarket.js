import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 

function GemMarket({ selectedGems, transferGemOwnership }) {
  const navigate = useNavigate();
  const gemsSale = selectedGems.filter(gem => gem.forSale);

  const [firestoreMetadataSelected, setFirestoreMetadataSelected] = useState({}); // Metaadatok a kiválasztott kövekhez

  // Firestore metaadatok lekérése
  const fetchFirestoreMetadataForSelected = async (docId, gemId) => {
    try {
      const docRef = doc(firestore, 'gems', docId); // Firestore dokumentum lekérése
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFirestoreMetadataSelected(prevState => ({
          ...prevState,
          [gemId]: docSnap.data()
        }));
      } else {
        console.error('No such document for selected gem metadata');
      }
    } catch (error) {
      console.error('Error fetching Firestore metadata for selected gems:', error);
    }
  };

  useEffect(() => {
    gemsSale.forEach((gem) => {
      if (gem.metadataHash) {
        fetchFirestoreMetadataForSelected(gem.metadataHash, gem.id);
      }
    });
  }, [gemsSale]);

  const handleMarkAsSelected = (gemId, price) => {
    transferGemOwnership(gemId, price);
  };

  const renderGemsSale = () => {
    return gemsSale.map((gem, key) => (
      <div key={key} className="card market-card">
        {firestoreMetadataSelected[gem.id] && firestoreMetadataSelected[gem.id].fileUrl && (
          <a href={firestoreMetadataSelected[gem.id].fileUrl} target="_blank" rel="noopener noreferrer">
            <img src={firestoreMetadataSelected[gem.id].fileUrl} alt="Gem image" className="details-image" />
          </a>
        )}
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
