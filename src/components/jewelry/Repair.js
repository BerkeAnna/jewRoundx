import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Details.css';

function Repair({ selectedGems, updateGem, markGemAsUsed, minedGems, jewelry, jewelryContract, account, selectingContract, replaceGem }) {
  const { id } = useParams();
  const gemId = id;
  const navigate = useNavigate();
  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const [pinataMetadata, setPinataMetadata] = useState(null); 

  const fetchPinataMetadata = async (hash) => {
    try {
      const cleanedHash = hash.startsWith('https://gateway.pinata.cloud/ipfs/')
        ? hash.replace('https://gateway.pinata.cloud/ipfs/', '')
        : hash;
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setPinataMetadata(data);
    } catch (error) {
      console.error('Error fetching Pinata metadata:', error);
    }
  };

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const details = await jewelryContract.methods.getJewelryDetails(id).call();
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId, 10));
        setPrevGemsArray(gemIdsAsInt);
      } catch (error) {
        console.error("Error fetching jewelry details:", error);
      }
    };

    fetchJewelryDetails();

    if (selectedGems.length > 0) {
      selectedGems.forEach((gem) => {
        if (gem.metadataHash) {
          fetchPinataMetadata(gem.metadataHash);
        }
      });
    }
  }, [id, jewelryContract, selectedGems]);

  const renderSelectedOwnedGem = () => {
    const filteredSelectedGems = selectedGems.filter(gem => prevGemsArray.includes(parseInt(gem.id, 10)));

    return filteredSelectedGems.map((gem, key) => (
      gem.replaced === false && (
        <div key={key} className="card">
          <h2>Selected Gem Details</h2>
          {gem.fileURL && (
            <div>
              <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
                <img src={gem.fileURL} alt="Picture" className="details-image" />
              </a>
            </div>
          )}
          <p><strong>ID:</strong> {gem.id.toString()}</p>
          
          {pinataMetadata && (
            <div>
              <p><strong>Gem Type:</strong> {pinataMetadata.gemType}</p>
              <p><strong>Size:</strong> {pinataMetadata.size}</p>
              <p><strong>Carat:</strong> {pinataMetadata.carat} ct</p>
              <p><strong>Color:</strong> {pinataMetadata.color}</p>
              <p><strong>Polishing:</strong> {pinataMetadata.polishing}</p>
              <p><strong>Transparency:</strong> {pinataMetadata.transparency}</p>
              <p><strong>Treatments:</strong> {pinataMetadata.treatments}</p>
            </div>
          )}

          <p><strong>For Sale:</strong> {gem.forSale.toString()}</p>
          <p><strong>Used:</strong> {gem.used.toString()}</p>
          <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
          <p><strong>Gem Cutter:</strong> {gem.gemCutter}</p>
          <p><strong>Owner:</strong> {gem.owner}</p>
        <button onClick={() => navigate(`/repair/${id}/change-gem/${gem.id}`)}>Change</button>
        </div>
      )
    ));
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
