import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase'; // Firestore import
import { doc, getDoc } from 'firebase/firestore'; // Firestore lekérdezéshez
import '../../styles/Details.css';

function JewProcessing({ selectedGems, updateGem, markGemAsUsed, account, jewelryContract }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState({}); // Metaadatok a kiválasztott kövekhez
  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const [firestoreMetadata, setFirestoreMetadata] = useState({}); // State for metadata

  const handleRepair = (gemId) => {
    markGemAsUsed(gemId);
    updateGem(parseInt(id), gemId);
    navigate(`/jewelry-details/${id}`);
  };

  // Firestore-ból metaadatok lekérése az egyes kövekhez
  const fetchMetadataFromFirestore = async (gemId) => {
    try {
      const docRef = doc(firestore, 'gems', gemId.toString()); // Az azonosítót stringgé alakítjuk
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data(); // Ha létezik a dokumentum, visszaadjuk az adatokat
      } else {
        console.error('No such document in Firestore for gem:', gemId);
        return null;
      }
    } catch (error) {
      console.error('Error fetching metadata from Firestore:', error);
      return null;
    }
  };

  const ownedSelectedGems = selectedGems.filter((selectedGem) => selectedGem.owner === account);
  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const details = await jewelryContract.methods.getJewelryDetails(id).call();
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId, 10));
        setPrevGemsArray(gemIdsAsInt);
      } catch (error) {
        console.error("Error fetching jewelry details: ", error);
      }
    };

    const fetchFirestoreMetadata = async () => {
      const metadata = {};
      const promises = ownedSelectedGems.map(async (gem) => {
        if (gem.metadataHash) {
          const docRef = doc(firestore, 'gems', gem.metadataHash);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            metadata[gem.id] = docSnap.data(); // Store the entire metadata object for each gem by ID
          }
        }
      });
      await Promise.all(promises);
      setFirestoreMetadata(metadata);
    };

    fetchFirestoreMetadata();
    fetchJewelryDetails();
  }, [id, jewelryContract, ownedSelectedGems]);

  const renderSelectedGems = () => {
    return ownedSelectedGems.map((gem, key) => {
      const gemMetadata = firestoreMetadata[gem.id] || {}; // Access metadata for this gem

      return gem.used === false && (
        <tr key={key}>
          <td>{gem.id.toString()}</td>
          <td>{gemMetadata.size || 'N/A'}</td>
          <td>{gemMetadata.carat || 'N/A'} ct</td>
          <td>{`${gemMetadata.color || 'N/A'} ${gemMetadata.gemType || 'N/A'}`}</td>
          <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
          <td>
            <button onClick={() => handleRepair(parseInt(gem.id.toString()))} className="btn btn-primary">
              Add gem
            </button>
            <button className="btn" onClick={() => navigate(`/gem-details/${gem.id}`)}>
              Details
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div id="tables" className="pt-5">
      <h2>Change Gem</h2>
      <h2>Choose the next gem</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Size</th>
            <th>Carat</th>
            <th>Color and type</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {renderSelectedGems()}
        </tbody>
      </table>
    </div>
  );
}

export default JewProcessing;
