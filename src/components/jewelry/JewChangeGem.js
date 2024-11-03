import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase'; // Import Firestore
import { doc, getDoc } from 'firebase/firestore';

function JewChangeGem({ selectedGems, markGemAsUsed, jewelryContract, account, replaceGem, markGemAsReplaced }) {
  const { id, oldGemId } = useParams();
  const navigate = useNavigate();
  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const [firestoreMetadata, setFirestoreMetadata] = useState({}); // State for metadata

  const handleRepair = (newGemId) => {
    console.log('Jewelry ID:', id, 'Old Gem ID:', oldGemId, 'New Gem ID:', newGemId);
    markGemAsUsed(newGemId);
    replaceGem(id, oldGemId, newGemId);
    markGemAsReplaced(oldGemId);
    navigate(`/jewelry-details/${id}`);
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

    fetchJewelryDetails();
  }, [id, jewelryContract]);

  useEffect(() => {
    const fetchFirestoreMetadata = async () => {
      const metadata = {};
      const promises = ownedSelectedGems.map(async (gem) => {
        if (gem.metadataHash) {
          const docRef = doc(firestore, 'gems', gem.metadataHash);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            metadata[gem.id] = docSnap.data(); // Store the entire metadata object
          }
        }
      });
      await Promise.all(promises);
      setFirestoreMetadata(metadata);
    };

    fetchFirestoreMetadata();
  }, [ownedSelectedGems]);

  const renderSelectedGems = () => {
    return ownedSelectedGems.map((gem, key) => {
      const metadata = firestoreMetadata[gem.id] || {}; // Get metadata for this gem

      return gem.used === false && (
        <tr key={key}>
          <td>{gem.id.toString()}</td>
          <td>{metadata.size || 'N/A'}</td>
          <td>{metadata.carat || 'N/A'}</td>
          <td>{`${metadata.color || 'N/A'} ${metadata.gemType || 'N/A'}`}</td>
          <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
          <td>
            <button onClick={() => handleRepair(parseInt(gem.id.toString()))} className="btn btn-primary">
              Select
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

export default JewChangeGem;
