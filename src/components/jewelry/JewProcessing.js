import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Details.css';

function JewProcessing({ selectedGems, updateGem, markGemAsUsed, jewelryContract, account }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const [gemMetadata, setGemMetadata] = useState({}); // State to store metadata for each gem

  const handleRepair = (gemId) => {
    markGemAsUsed(gemId);
    updateGem(parseInt(id), gemId);
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

  // Function to fetch metadata from IPFS using Pinata
  const fetchPinataMetadata = async (hash, gemId) => {
    try {
      const cleanedHash = hash.startsWith('https://gateway.pinata.cloud/ipfs/') ? hash.replace('https://gateway.pinata.cloud/ipfs/', '') : hash;
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setGemMetadata(prevState => ({
        ...prevState,
        [gemId]: data, // Store metadata under the gem's ID
      }));
    } catch (error) {
      console.error('Error fetching metadata from Pinata:', error);
    }
  };

  // Fetch metadata for each owned selected gem if not already fetched
  useEffect(() => {
    ownedSelectedGems.forEach(gem => {
      if (gem.metadataHash && !gemMetadata[gem.id]) {
        fetchPinataMetadata(gem.metadataHash, gem.id);
      }
    });
  }, [ownedSelectedGems, gemMetadata]);

  const renderSelectedGems = () => {
    return ownedSelectedGems.map((gem, key) => (
      gem.used === false ? (
        <tr key={key}>
          <td>{gem.id.toString()}</td>
          <td>{gemMetadata[gem.id] && gemMetadata[gem.id].gemType ? gemMetadata[gem.id].gemType : 'Loading...'}</td> {/* Display gemType from metadata */}
          <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
          <td>
            <button onClick={() => handleRepair(gem.id)} className="btn">
              Select
            </button>
            <button className="btn" onClick={() => navigate(`/gem-details/${gem.id}`)}>
              Details
            </button>
          </td>
        </tr>
      ) : null
    ));
  };

  return (
    <div id="tables" className="pt-5">
      <h1>Processing Jewelry</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Gem Type</th> {/* Add Gem Type column */}
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
