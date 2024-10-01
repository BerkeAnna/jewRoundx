import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function JewDetails({ selectedGems, minedGems, jewelry, account, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract }) {
  const { id } = useParams();
  const gemId = id;

  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const [filteredJewelryEvents, setFilteredJewelryEvents] = useState([]);
  const [filteredSelectedGemEvents, setFilteredSelectedGemEvents] = useState([]);
  const [filteredMinedGemEvents, setFilteredMinedGemEvents] = useState([]);
  const [blockDates, setBlockDates] = useState({});
  const [pinataMetadataJew, setPinataMetadataJew] = useState(null); 
  const [pinataMetadataMined, setPinataMetadataMined] = useState({}); 
  const [pinataMetadataSelected, setPinataMetadataSelected] = useState({}); 
  const [currentSelectedGemIndex, setCurrentSelectedGemIndex] = useState(0);
  const [currentMinedGemIndex, setCurrentMinedGemIndex] = useState(0);

  const jewelryDetails = jewelry.filter(item => item.id == gemId);

  const fetchPinataMetadataForSelected = async (hash, gemId) => {
    try {
      const cleanedHash = cleanHash(hash);
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setPinataMetadataSelected(prevState => ({
        ...prevState,
        [gemId]: data
      }));
    } catch (error) {
      console.error('Error fetching Pinata metadata for selected gems:', error);
    }
  };

  const fetchPinataMetadataMined = async (hash, gemId) => {
    try {
      const cleanedHash = cleanHash(hash);
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setPinataMetadataMined(prevState => ({
        ...prevState,
        [gemId]: data
      }));
    } catch (error) {
      console.error('Error fetching Pinata metadata for mined gems:', error);
    }
  };

  const cleanHash = (hash) => {
    if (hash.startsWith('https://gateway.pinata.cloud/ipfs/')) {
      return hash.replace('https://gateway.pinata.cloud/ipfs/', '');
    }
    return hash;
  };

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const details = await jewelryContract.methods.getJewelryDetails(id).call();
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId.toString(), 10));
        setPrevGemsArray(gemIdsAsInt);

        // Fetch metadata for each gem
        for (const gemId of gemIdsAsInt) {
          const selectedGem = selectedGems.find(gem => gem.id == gemId);
          if (selectedGem && selectedGem.metadataHash) {
            await fetchPinataMetadataForSelected(selectedGem.metadataHash, gemId);
          }

          const minedGem = minedGems.find(gem => gem.id == gemId);
          if (minedGem && minedGem.metadataHash) {
            await fetchPinataMetadataMined(minedGem.metadataHash, gemId);
          }
        }

      } catch (error) {
        console.error('Error fetching jewelry details:', error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract, selectedGems, minedGems]);

  const handlePrevSelectedGem = () => {
    setCurrentSelectedGemIndex(prevIndex => (prevIndex === 0 ? prevGemsArray.length - 1 : prevIndex - 1));
  };

  const handleNextSelectedGem = () => {
    setCurrentSelectedGemIndex(prevIndex => (prevIndex === prevGemsArray.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrevMinedGem = () => {
    setCurrentMinedGemIndex(prevIndex => (prevIndex === 0 ? prevGemsArray.length - 1 : prevIndex - 1));
  };

  const handleNextMinedGem = () => {
    setCurrentMinedGemIndex(prevIndex => (prevIndex === prevGemsArray.length - 1 ? 0 : prevIndex + 1));
  };

  const renderJewelrySelectedGem = () => {
    const gemId = prevGemsArray[currentSelectedGemIndex];
    const selectedGem = selectedGems.find(gem => gem.id == gemId);
    const metadata = pinataMetadataSelected[gemId];

    if (!selectedGem) return null;

    return (
      <div className="card">
        <h2>Selected Gem Details</h2>
        {metadata && metadata.fileUrl && (
          <a href={metadata.fileUrl} target="_blank" rel="noopener noreferrer">
            <img src={metadata.fileUrl} alt="Gem image" className="details-image" />
          </a>
        )}
        <p><strong>ID:</strong> {selectedGem.id.toString()}</p>
        {metadata && (
          <div>
            <p><strong>Gem Type:</strong> {metadata.gemType}</p>
            <p><strong>Size:</strong> {metadata.size}</p>
            <p><strong>Carat:</strong> {metadata.carat} ct</p>
            <p><strong>Color:</strong> {metadata.color}</p>
          </div>
        )}
        <p><strong>forSale:</strong> {selectedGem.forSale.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(selectedGem.price.toString(), 'Ether')} Eth</p>
      </div>
    );
  };

  const renderJewelryMinedGem = () => {
    const gemId = prevGemsArray[currentMinedGemIndex];
    const minedGem = minedGems.find(gem => gem.id == gemId);
    const metadata = pinataMetadataMined[gemId];

    if (!minedGem) return null;

    return (
      <div className="card">
        <h2>Mined Gem Details</h2>
        {metadata && metadata.fileUrl && (
          <a href={metadata.fileUrl} target="_blank" rel="noopener noreferrer">
            <img src={metadata.fileUrl} alt="Gem image" className="details-image" />
          </a>
        )}
        <p><strong>ID:</strong> {minedGem.id.toString()}</p>
        {metadata && (
          <div>
            <p><strong>Gem Type:</strong> {metadata.gemType}</p>
            <p><strong>Weight:</strong> {metadata.weight}</p>
            <p><strong>Size:</strong> {metadata.size}</p>
            <p><strong>Mining Location:</strong> {metadata.miningLocation}</p>
            <p><strong>Mining Year:</strong> {metadata.miningYear}</p>
          </div>
        )}
        <p><strong>Price:</strong> {window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Miner:</strong> {minedGem.miner}</p>
      </div>
    );
  };

  return (
    <div className="details-details-container card-background pt-5">
      <h1>Jewelry Details</h1>

      {/* Jewelry Details */}
      <div className="card-container pt-5">
        {jewelryDetails.map((jewelry, key) => (
          <div key={key} className="card">
            <h2>Jewelry Details</h2>
            <p><strong>ID:</strong> {jewelry.id.toString()}</p>
            <p><strong>Name:</strong> {jewelry.name}</p>
          </div>
        ))}
      </div>

      {/* Selected Gem Section */}
      <div className="gem-container">
        <button className="arrow left" onClick={handlePrevSelectedGem}>←</button>
        {renderJewelrySelectedGem()}
        <button className="arrow right" onClick={handleNextSelectedGem}>→</button>
      </div>

      {/* Mined Gem Section */}
      <div className="gem-container">
        <button className="arrow left" onClick={handlePrevMinedGem}>←</button>
        {renderJewelryMinedGem()}
        <button className="arrow right" onClick={handleNextMinedGem}>→</button>
      </div>
    </div>
  );
}

export default JewDetails;
