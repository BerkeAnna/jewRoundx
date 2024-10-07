import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Market.css';
import { firestore } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore'; 


function MinedGemMarket({ minedGems, account, markNewOwner }) {
  const navigate = useNavigate();
  const ownedMinedGems = minedGems.filter(minedGem => minedGem.owner !== account); 
  const [firestoreMetadataMined, setFirestoreMetadataMined] = useState({}); // Metaadatok tárolása objektumban, gem ID szerint

  const handleMarkAsSelected = (gemId, price) => {
    markNewOwner(gemId, price);
  };

  // Firestore metaadatok lekérése gem ID alapján
  const fetchFirestoreMetadataMined = async (docId, gemId) => {
    try {
      const docRef = doc(firestore, 'minedGems', docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Csak a fileUrl-t mentjük el
        if (data.fileUrl) {
          setFirestoreMetadataMined(prevState => ({
            ...prevState,
            [gemId]: data.fileUrl // Csak a fileUrl mentése az állapotba
          }));
        } else {
          console.error(`Nem található fileUrl a dokumentumban: ${gemId}`);
        }
      } else {
        console.error(`Nincs ilyen dokumentum a Firestore-ban: ${gemId}`);
      }
    } catch (error) {
      console.error('Hiba a Firestore lekérdezés során:', error);
    }
  };
  

  // useEffect a metaadatok lekérésére minden bányászott gem-hez
  useEffect(() => {
    ownedMinedGems.forEach((gem) => {
      if (gem.metadataHash) {
      fetchFirestoreMetadataMined(gem.metadataHash, gem.id); // Lekérjük a gem metaadatait Firestore-ból
   
    }});
  }, [ownedMinedGems]);

  const renderMinedGems = () => {
    return ownedMinedGems.map((minedGem, key) => (
      minedGem.purchased === true && minedGem.selected === false && (
      <div key={key} className="card market-card">
        {firestoreMetadataMined[minedGem.id] ? (
          <a href={firestoreMetadataMined[minedGem.id]} target="_blank" rel="noopener noreferrer">
            <img src={firestoreMetadataMined[minedGem.id]} alt="Gem image" className="details-image" />
          </a>
        ) : (
          <p>No image available</p> // Alternatív szöveg, ha nincs kép
        )}
        <p><strong>ID:</strong> {minedGem.id.toString()}</p>
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
