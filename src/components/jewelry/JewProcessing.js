import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Details.css'

function JewProcessing({ selectedGems, updateGem, markGemAsUsed  }) {
  const { id } = useParams();
  const navigate = useNavigate();  
  const [metadata, setMetadata] = useState({});// Metaadatok a kiválasztott kövekhez


  const handleRepair = (gemId) => {
    markGemAsUsed(gemId);
    updateGem(parseInt(id), gemId);
    navigate(`/jewelry-details/${id}`);
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      const metadataPromises = selectedGems.map(async (gem) => {
        const cleanedHash = cleanHash(gem.metadataHash);
        const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
        const response = await fetch(url);
        const data = await response.json();
        return { id: gem.id, data }; // Gem ID-hez kapcsoljuk a lekért adatokat
      });

      const metadataResults = await Promise.all(metadataPromises);
      const metadataMap = {};
      metadataResults.forEach((item) => {
        metadataMap[item.id] = item.data;
      });
      setMetadata(metadataMap); // Tároljuk az összes metaadatot egy objektumban
    };

    fetchMetadata();
  }, [selectedGems]);

  // Hash tisztítás függvény
 const cleanHash = (hash) => {
  if (hash && typeof hash === 'string' && hash.startsWith('https://gateway.pinata.cloud/ipfs/')) {
    return hash.replace('https://gateway.pinata.cloud/ipfs/', '');
  }
  return hash || ''; // Visszaad egy üres stringet, ha a hash undefined
};


  const renderSelectedGems = () => {
    return selectedGems.map((gem, key) => {
      if (gem.used === false) {
        return (
          <tr key={key}>
            <td>{gem.id.toString()}</td>
            <td>{gem.size}</td>
            <td>{gem.carat.toString()} ct</td>
            <td>{gem.colorGemType}</td>
            <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
            <td>
              <button onClick={() => handleRepair(gem.id)} className="btn">
                Select
              </button>
            </td>
          </tr>
        );
      }
      return null;
    });
  };

  return (
    <div className="details-details-container pt-5" >
      <h1>Processing Jewelry</h1>
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
        <tbody>{renderSelectedGems()}</tbody>
      </table>
    </div>
  );
}

export default JewProcessing;