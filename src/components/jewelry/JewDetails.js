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
  const [allTransactions, setAllTransactions] = useState([]); 
  const [currentSelectedGemIndex, setCurrentSelectedGemIndex] = useState(0);
  const [currentMinedGemIndex, setCurrentMinedGemIndex] = useState(0);

  const jewelryDetails = jewelry.filter(item => item.id == gemId);

  const getTransactionDate = async (web3, blockNumber) => {
    const block = await web3.eth.getBlock(blockNumber);
    return new Date(block.timestamp * 1000);
  };
  
  const fetchJewTransactions = async () => {
    try {
      const allJewelryEvents = await jewelryContract.getPastEvents('allEvents', { fromBlock: 0, toBlock: 'latest' });
      const allEvents = [...allJewelryEvents];
      setAllTransactions(allEvents);
      
      const blockNumbers = allEvents.map(event => event.blockNumber);
      const uniqueBlockNumbers = [...new Set(blockNumbers)];
  
      const blockDatesMap = {};
      for (let blockNumber of uniqueBlockNumbers) {
        blockDatesMap[blockNumber] = await getTransactionDate(window.web3, blockNumber);
      }
      setBlockDates(blockDatesMap);
    } catch (error) {
      console.error('Error fetching all transactions:', error);
    }
  };

  const fetchPinataMetadataMined = async (hash, gemId) => {
    try {
      const cleanedHash = cleanHash(hash); // Hash tisztítás
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setPinataMetadataMined(prevState => ({
        ...prevState,
        [gemId]: data
      }));
    } catch (error) {
      console.error('Error fetching Pinata metadata:', error);
    }
  };
  
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
  
  const fetchPinataMetadataJew = async (hash) => {
    try {
      const cleanedHash = cleanHash(hash);
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setPinataMetadataJew(data);
    } catch (error) {
      console.error('Error fetching Pinata metadata:', error);
    }
  };
  
  // Hash tisztítás függvény
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

        const jewelryEvents = await jewelryContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        const filteredJewelry = jewelryEvents.filter(event => parseInt(event.returnValues.id) === parseInt(id));
        setFilteredJewelryEvents(filteredJewelry);

        // Kiválasztott gem események lekérése
        const selectedGemEvents = await gemstoneSelectingContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        const filteredSelectedGems = selectedGemEvents.filter(event =>
          gemIdsAsInt.includes(parseInt(event.returnValues.id))
        );
        setFilteredSelectedGemEvents(filteredSelectedGems);

        // Bányászott gem események lekérése
        const minedGemEvents = await gemstoneExtractionContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        const filteredMinedGems = minedGemEvents.filter(event =>
          gemIdsAsInt.includes(parseInt(event.returnValues.id))
        );
        setFilteredMinedGemEvents(filteredMinedGems);

        // Metaadatok lekérése minden egyes kőhöz
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

        if (details.metadataHash) {
          await fetchPinataMetadataJew(details.metadataHash);
        }

        fetchJewTransactions();

      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract, selectedGems, minedGems]);


  const renderJewelrySelectedGems = () => {
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
        
        <p><strong> {selectedGem.replaced ? "Changed earlier" : "Currently in jewelry" }</strong></p>

        {metadata && (
          <div>
            <p><strong>Gem Type:</strong> {metadata.gemType}</p>
            <p><strong>Size:</strong> {metadata.size}</p>
            <p><strong>Carat:</strong> {metadata.carat} ct</p>
            <p><strong>Color:</strong> {metadata.color}</p>
          </div>
        )}
            <p><strong>Previous gem ID:</strong> {selectedGem.previousGemId.toString()}</p>
        <p><strong>forSale:</strong> {selectedGem.forSale.toString()}</p>
        <p><strong>replaced:</strong> {selectedGem.replaced.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(selectedGem.price.toString(), 'Ether')} Eth</p>
        
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredSelectedGemEvents, selectedGem.id)}
      </div>
    );
  };
  

  const renderJewelryMinedGems = () => {
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
        
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredMinedGemEvents, minedGem.id)}
      </div>
    );
  };

  const renderTransactionDetails = (events, gemId) => {
    const gemEvents = events.filter(event => {
      const eventId = parseInt(event.returnValues.id); 
      return eventId === parseInt(gemId);
    });

    if (gemEvents.length === 0) {
      return <p>No transaction events found for this item.</p>;
    }

    return (
      <ul className="no-bullet-list">
        {gemEvents.map((event, index) => {
          const { owner, gemCutter, jeweler, newOwner } = event.returnValues;

          return (
            <li key={index} className="details-list-item">
              <strong>Event:</strong> {event.event}
              <br />
              <strong>Transaction Hash:</strong> {event.transactionHash}
              <br />
              <strong>Block Number:</strong> {event.blockNumber}
              <br />
              {blockDates[event.blockNumber] && (
                <>
                  <strong>Date:</strong> {blockDates[event.blockNumber].toLocaleString()}
                </>
              )}
              <br />
              {owner && <div><strong>Owner:</strong> {owner}</div>}
              {gemCutter && <div><strong>Gem Cutter:</strong> {gemCutter}</div>}
              {jeweler && <div><strong>Jeweler:</strong> {jeweler}</div>}
              {newOwner && <div><strong>New Owner:</strong> {newOwner}</div>}
            </li>
          );
        })}
      </ul>
    );
  };

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
        <p><strong>ID:</strong> {jewelry.id.toString()}</p>
        <p><strong>Name:</strong> {jewelry.name}</p>

        {pinataMetadataJew && (
          <div>
            <p><strong>Metal:</strong> {pinataMetadataJew.metal}</p>
            <p><strong>Size:</strong> {pinataMetadataJew.size}</p>
            <p><strong>Gem ID:</strong> {pinataMetadataJew.gemId}</p>
          </div>
        )}

        <p><strong>Processing:</strong> {jewelry.processing.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(jewelry.price.toString(), 'Ether')} Eth</p>
        <p><strong>Jeweler:</strong> {jewelry.jeweler}</p>
        <p><strong>Owner:</strong> {jewelry.owner}</p>
        <p><strong>Jewelry Owner:</strong> {jewelry.jewOwner}</p>
        <p><strong>Sale:</strong> {jewelry.sale.toString()}</p>
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredJewelryEvents, jewelry.id)}
      </div>
    ));
  };

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

  return (
    <div className="details-details-container card-background pt-5">
      <h1>Jewelry Details</h1>
      <div className="card-container pt-5">
        {renderJewelry()}
      </div>
      <div className="card-container pt-5">
        <button className="arrow left" onClick={handlePrevSelectedGem}>←</button>
        {renderJewelrySelectedGems()}
        <button className="arrow right" onClick={handleNextSelectedGem}>→</button>
      </div>
      <div className="card-container pt-5">
        <button className="arrow left" onClick={handlePrevMinedGem}>←</button>
        {renderJewelryMinedGems()}
        <button className="arrow right" onClick={handleNextMinedGem}>→</button>
      </div>
    </div>
  );
}

export default JewDetails;
