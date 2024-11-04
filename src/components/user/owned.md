import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OwnedByUser({ minedGems, selectedGems, jewelry, account, purchaseGem, polishGem, markedAsFinished, markedAsSale, addForRepair, returnToOwner }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedGemMetadata, setSelectedGemMetadata] = useState({}); // Metaadatok tárolása

  // Load user data from localStorage
  const username = localStorage.getItem('username') || '';
  const role = localStorage.getItem('role') || '';

  console.log(role);

  const handleMarkAsSelected = (gemId) => {
    navigate(`/gem-select/${gemId}`);
  };

  // Metaadatok lekérése a Pinatából
  const fetchPinataMetadataForSelected = async (hash, gemId) => {
    try {
      const cleanedHash = cleanHash(hash);
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setSelectedGemMetadata(prevState => ({
        ...prevState,
        [gemId]: data, // Hozzáadás a megfelelő gemId-hoz
      }));
    } catch (error) {
      console.error('Error fetching Pinata metadata for selected gems:', error);
    }
  };

  // Hash tisztítás
  const cleanHash = (hash) => {
    if (hash.startsWith('https://gateway.pinata.cloud/ipfs/')) {
      return hash.replace('https://gateway.pinata.cloud/ipfs/', '');
    }
    return hash;
  };

  const handleJewMaking = (gemId) => {
    navigate(`/jewelry-making/gem/${gemId}`);
  };

  const handleMarkedAsFinished = (gemId) => {
    markedAsFinished(gemId);
    navigate(`/ownMinedGems`);
  };

  const handleMarkedAsSale = (gemId) => {
    markedAsSale(gemId);
    navigate(`/ownMinedGems`);
  };

  const handleAddRepair = (gemId) => {
    addForRepair(gemId);
    navigate(`/ownMinedGems`);
  };

  const handleReturnToOwner = (gemId) => {
    returnToOwner(gemId);
    navigate(`/ownMinedGems`);
  };

  const ownedMinedGems = minedGems.filter((minedGem) => minedGem.owner === account);
  const ownedSelectedGems = selectedGems.filter((selectedGem) => selectedGem.owner === account);
  const ownedJewelry = jewelry.filter((jewelry) => jewelry.owner === account);

  useEffect(() => {
    ownedSelectedGems.forEach(gem => {
      if (gem.metadataHash && !selectedGemMetadata[gem.id]) {
        fetchPinataMetadataForSelected(gem.metadataHash, gem.id);
      }
    });
  }, [ownedSelectedGems, selectedGemMetadata]);

  const renderProcessingGems = () => {
    return ownedSelectedGems.map((selectedGem, key) => (
      selectedGem.used === false && (
        <tr key={key}>
          <th scope="row">{selectedGem.id.toString()}</th>
          <td>
            {selectedGemMetadata[selectedGem.id] && selectedGemMetadata[selectedGem.id].gemType 
              ? selectedGemMetadata[selectedGem.id].gemType 
              : 'Loading...'}
          </td> {/* Correctly rendered gemType */}
          <td>{window.web3.utils.fromWei(selectedGem.price.toString(), 'Ether')} Eth</td>
          <td>{selectedGem.owner}</td>
          <td className="button-container">
            {!selectedGem.forSale && !selectedGem.used ? (
              <>
                <button onClick={() => navigate(`/gem-details/${selectedGem.id}`)} className="btn">
                  Details
                </button>
                {role === 'Jeweler' && (
                  <button onClick={() => handleJewMaking(selectedGem.id)} className="btn">
                    Make jewelry
                  </button>
                )}
                <button onClick={() => polishGem(selectedGem.id)} className="btn">
                  ForSale
                </button>
              </>
            ) : (
              <div>
                <button onClick={() => navigate(`/gem-details/${selectedGem.id}`)} className="btn">
                  Details
                </button>
                <button onClick={() => polishGem(selectedGem.id)} className="btn">
                  Remove from market
                </button>
              </div>
            )}
          </td>
        </tr>
      )
    ));
  };
  

  return (
    <div id="tables" className="pt-5">
      {(role === 'Gem Cutter' || role === 'Jeweler') && (
        <div>
          <h2>List of processing gems</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Gem Type</th>
                <th scope="col">Price</th>
                <th scope="col">Owner</th>
                <th scope="col">*</th>
              </tr>
            </thead>
            <tbody>{renderProcessingGems()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OwnedByUser;
