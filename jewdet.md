import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function JewDetails({ selectedGems, minedGems, jewelry, account, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract }) {
  const { id } = useParams();
  const gemId = id;

  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const [filteredJewelryEvents, setFilteredJewelryEvents] = useState([]);
  const [filteredSelectedGemEvents, setFilteredSelectedGemEvents] = useState([]);
  const [filteredMinedGemEvents, setFilteredMinedGemEvents] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [blockDates, setBlockDates] = useState({});
  const [pinataMetadata, setPinataMetadata] = useState(null); // Metaadatok az ékszerről
  
  const jewelryDetails = jewelry.filter(item => item.id == gemId);

  const getTransactionDate = async (web3, blockNumber) => {
    const block = await web3.eth.getBlock(blockNumber);
    return new Date(block.timestamp * 1000);
  };

  // Pinata metaadatok lekérése az ékszerhez
  const fetchPinataMetadata = async (url) => {
    try {
      const response = await fetch(url); // Pinata metaadatok lekérése
      const data = await response.json();
      setPinataMetadata(data); // Beállítjuk a lekért adatokat
    } catch (error) {
      console.error('Error fetching Pinata metadata:', error);
    }
  };

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const details = await jewelryContract.methods.getJewelryDetails(id).call();
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId.toString(), 10));
        setPrevGemsArray(gemIdsAsInt);

        const jewelryEvents = await jewelryContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        const filteredJewelry = jewelryEvents.filter(event => parseInt(event.returnValues.id) === parseInt(id));
        setFilteredJewelryEvents(filteredJewelry);

        const selectedGemEvents = await gemstoneSelectingContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        const filteredSelectedGems = selectedGemEvents.filter(event =>
          gemIdsAsInt.includes(parseInt(event.returnValues.id))
        );
        setFilteredSelectedGemEvents(filteredSelectedGems);

        const minedGemEvents = await gemstoneExtractionContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        const filteredMinedGems = minedGemEvents.filter(event =>
          gemIdsAsInt.includes(parseInt(event.returnValues.id))
        );
        setFilteredMinedGemEvents(filteredMinedGems);

        // Pinata metaadatok lekérése, ha van metadataHash
        if (details.metadataHash) {
          fetchPinataMetadata(details.metadataHash);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract]);

  const renderJewelry = () => {
    return jewelryDetails.map((jewelry, key) => (
      <div key={key} className="card">
        <h2>Jewelry Details</h2>
        {jewelry.fileURL && (
          <div>
            <a href={jewelry.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={jewelry.fileURL} alt="Jewelry" className='details-image' />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {jewelry.id ? jewelry.id.toString() : 'N/A'}</p>
        <p><strong>Name:</strong> {jewelry.name ? jewelry.name : 'N/A'}</p>

        {/* Ha van Pinata metaadat */}
        {pinataMetadata && (
          <div>
            <p><strong>Metal:</strong> {pinataMetadata.metal}</p>
            <p><strong>Size:</strong> {pinataMetadata.size}</p>
            <p><strong>Gem ID:</strong> {pinataMetadata.gemId}</p>
          </div>
        )}

        <p><strong>Processing:</strong> {jewelry.processing ? jewelry.processing.toString() : 'N/A'}</p>
        <p><strong>Price:</strong> {jewelry.price ? window.web3.utils.fromWei(jewelry.price.toString(), 'Ether') : 'N/A'} Eth</p>
        <p><strong>Jeweler:</strong> {jewelry.jeweler ? jewelry.jeweler : 'N/A'}</p>
        <p><strong>Owner:</strong> {jewelry.owner ? jewelry.owner : 'N/A'}</p>
      </div>
    ));
  };

  return (
    <div className="details-details-container card-background pt-5">
      <h1>Jewelry Details</h1>
      <div className="card-container pt-5">
        {renderJewelry()}
      </div>
    </div>
  );
}

export default JewDetails;
