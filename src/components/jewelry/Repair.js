import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase'; // Firestore import
import { doc, getDoc } from 'firebase/firestore'; // Firestore for fetching data
import '../../styles/Details.css';

function Repair({ selectedGems, updateGem, markGemAsUsed, minedGems, jewelry, jewelryContract, account, selectingContract, replaceGem }) {
  const { id } = useParams();
  const gemId = id;
  const navigate = useNavigate();
  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const [firestoreMetadata, setFirestoreMetadata] = useState({}); // State for metadata

  const handleRepair = (newGemId) => {
    const oldGemId = parseInt(id);
    markGemAsUsed(newGemId);
    replaceGem(oldGemId, newGemId);
    navigate(`/jewelry-details/${id}`);
  };

  // Fetch jewelry details
  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const details = await jewelryContract.methods.getJewelryDetails(id).call();
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId, 10));
        setPrevGemsArray(gemIdsAsInt);
        console.log("Prev gems id (int): ", gemIdsAsInt);
      } catch (error) {
        console.error("Error fetching jewelry details: ", error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract]);

// Firestore metadata lekérése minden gemhez
useEffect(() => {
  const fetchFirestoreMetadata = async () => {
    const metadata = {};
    const promises = selectedGems.map(async (gem) => {
      if (gem.metadataHash) {
        const docRef = doc(firestore, 'gems', gem.metadataHash);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          metadata[gem.id] = {
            ...docSnap.data(),
            fileURL: docSnap.data().fileUrl || '' // fileURL is elérhető legyen
          };
        }
      }
    });
    await Promise.all(promises);
    setFirestoreMetadata(metadata);
  };

  fetchFirestoreMetadata();
}, [selectedGems]);

  const renderSelectedGems = () => {
    return selectedGems.map((gem, key) => {
      const gemMetadata = firestoreMetadata[gem.id] || {}; // Hozzáférés a gem metaadataihoz

      return gem.used === false && (
        <tr key={key}>
          <td>{gem.id.toString()}</td>
          <td>{gemMetadata.size || 'N/A'}</td>
          <td>{gemMetadata.carat || 'N/A'} ct</td>
          <td>{`${gemMetadata.color || 'N/A'} ${gemMetadata.gemType || 'N/A'}`}</td>
          <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
          <td>
            <button onClick={() => handleRepair(gem.id)} className="btn">
              Select
            </button>
          </td>
        </tr>
      );
    });
  };

  const renderSelectedOwnedGem = () => {
    const filteredSelectedGems = selectedGems.filter(
      gem => prevGemsArray.includes(parseInt(gem.id, 10)) && gem.replaced === false
    );
  
    return filteredSelectedGems.map((gem, key) => {
      const gemMetadata = firestoreMetadata[gem.id] || {}; // Hozzáférés a gem metaadataihoz
  
      return (
        <div key={key} className="card">
          <h2>Details of the processed gemstone</h2>
          {gemMetadata.fileURL && (
            <div>
              <a href={gemMetadata.fileURL} target="_blank" rel="noopener noreferrer">
                <img src={gemMetadata.fileURL} alt="Picture" className="details-image" />
              </a>
            </div>
          )}
          <p><strong>ID:</strong> {gem.id.toString()}</p>
          <p><strong>Size:</strong> {gemMetadata.size || 'N/A'} mm</p>
          <p><strong>Carat:</strong> {gemMetadata.carat || 'N/A'} ct</p>
          <p><strong>Color and gem type:</strong> {`${gemMetadata.color || 'N/A'} ${gemMetadata.gemType || 'N/A'}`}</p>
          <p><strong>Sale:</strong> {gem.forSale.toString()}</p>
          <p><strong>Used:</strong> {gem.used.toString()}</p>
          <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
          <p><strong>Gem cutter:</strong> {gem.gemCutter}</p>
          <p><strong>Owner:</strong> {gem.owner}</p>
          <button onClick={() => navigate(`/repair/${id}/change-gem/${gem.id}`)}>Gem exchange</button>
        </div>
      );
    });
  };
  

  return (
    <div className="details-details-container pt-5">
      <h1>Processing Jewelry</h1>
      <h3>Choose the next gem</h3>
      <div>{renderSelectedOwnedGem()}</div>
    </div>
  );
}

export default Repair;
