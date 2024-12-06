import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase'; // Firestore import
import { doc, getDoc } from 'firebase/firestore'; // Firestore queries

function JewMarket({ jewelry, account, buyJewelry }) {
  const navigate = useNavigate();
  const [firestoreMetadata, setFirestoreMetadata] = useState({});

  useEffect(() => {
    const fetchMetadata = async () => {
      const metadataPromises = jewelry.map(async (jewelryItem) => {
        if (jewelryItem.metadataHash) {
          try {
            const docRef = doc(firestore, 'jewelry', jewelryItem.metadataHash);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              return { id: jewelryItem.id, metadata: docSnap.data() };
            }
          } catch (error) {
            console.error(`Error fetching metadata for jewelry ID ${jewelryItem.id}:`, error);
          }
        }
        return { id: jewelryItem.id, metadata: null };
      });

      const metadataResults = await Promise.all(metadataPromises);
      const metadataMap = metadataResults.reduce((acc, result) => {
        acc[result.id] = result.metadata;
        return acc;
      }, {});
      setFirestoreMetadata(metadataMap);
    };

    fetchMetadata();
  }, [jewelry]);

  const navigateToJewDetails = (jewId) => {
    navigate(`/jewelry-details/${jewId}`);
  };

  const renderJewelryItems = () => {
    return jewelry.map((jewelryItem, key) => {
      const metadata = firestoreMetadata[jewelryItem.id];
  
      return (
        jewelryItem.owner !== account &&
        jewelryItem.processing === false &&
        jewelryItem.sale === true && (
          <div key={key} className="card market-card">
            {metadata && metadata.fileUrl ? (
              <img src={metadata.fileUrl} alt="Jewelry" className="card-img-top" />
            ) : null}
            <div className="card-body">
              <h5 className="card-title">
                {metadata && metadata.name ? metadata.name : jewelryItem.name}
              </h5>
              <p className="card-text">
                Price: {window.web3.utils.fromWei(jewelryItem.price.toString(), 'Ether')} Eth
              </p>
              <p className="card-text">Owner: {jewelryItem.owner}</p>
              <button
                className="btn btn-primary"
                onClick={() => navigateToJewDetails(jewelryItem.id)}
              >
                Details
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => buyJewelry(jewelryItem.id, jewelryItem.price)}
              >
                Buy
              </button>
            </div>
          </div>
        )
      );
    });
  };
  
  

  return (
    <div className="jew-market card-background">
      <p>&nbsp;</p>
      <h2>Jewelry Market</h2>
      <div className="jew-cards">{renderJewelryItems()}</div>
      <div className="homeButton">
        <button onClick={() => navigate(`/loggedIn`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default JewMarket;
