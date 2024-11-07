import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function JewDetails({ selectedGems, minedGems, jewelry, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract }) {
  const { id } = useParams();
  const gemId = id;
  const navigate = useNavigate();

  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const [filteredJewelryEvents, setFilteredJewelryEvents] = useState([]);
  const [filteredSelectedGemEvents, setFilteredSelectedGemEvents] = useState([]);
  const [blockDates, setBlockDates] = useState({});
  const [pinataMetadataJewelry, setPinataMetadataJewelry] = useState(null); 
  const [pinataMetadataSelected, setPinataMetadataSelected] = useState({}); 
  const [transactionGasDetails, setTransactionGasDetails] = useState({});
  const [currentSelectedGemIndex, setCurrentSelectedGemIndex] = useState(0);

  const jewelryDetails = jewelry.filter(item => item.id == gemId);

  const getTransactionDate = async (web3, blockNumber) => {
    const block = await web3.eth.getBlock(blockNumber);
    return new Date(block.timestamp * 1000);
  };
  
  const fetchAllTransactionDates = async (web3, events) => {
    const blockDatePromises = events.map(async (event) => {
      const date = await getTransactionDate(web3, event.blockNumber);
      return { blockNumber: event.blockNumber, date };
    });
    const blockDateResults = await Promise.all(blockDatePromises);
    
    const blockDateMap = {};
    blockDateResults.forEach(({ blockNumber, date }) => {
      blockDateMap[blockNumber] = date;
    });
    setBlockDates(previousDates => ({ ...previousDates, ...blockDateMap }));
  };

  // Gáz adatok lekérése a tranzakciókból
  const fetchGasDetails = async (events) => {
    const gasDetailsPromises = events.map(async (event) => {
      const receipt = await window.web3.eth.getTransactionReceipt(event.transactionHash);
      const transaction = await window.web3.eth.getTransaction(event.transactionHash);
      const gasUsed = receipt.gasUsed;
      const gasPrice = transaction.gasPrice;
      const gasCost = window.web3.utils.fromWei((gasUsed * gasPrice).toString(), 'ether');
      return { transactionHash: event.transactionHash, gasUsed, gasPrice, gasCost };
    });

    const gasDetailsResults = await Promise.all(gasDetailsPromises);
    const gasDetailsMap = {};
    gasDetailsResults.forEach(({ transactionHash, gasUsed, gasPrice, gasCost }) => {
      gasDetailsMap[transactionHash] = { gasUsed, gasPrice, gasCost };
    });
    setTransactionGasDetails(gasDetailsMap);
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

  const fetchPinataMetadataJewelry = async (hash) => {
    try {
      const cleanedHash = cleanHash(hash);
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setPinataMetadataJewelry(data);
    } catch (error) {
      console.error('Error fetching Pinata metadata:', error);
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
      
        for (const gemId of gemIdsAsInt) {
          const selectedGem = selectedGems.find(gem => gem.id == gemId);
          if (selectedGem && selectedGem.metadataHash) {
            await fetchPinataMetadataForSelected(selectedGem.metadataHash, gemId);
          }
        }

        if (details.metadataHash) {
          await fetchPinataMetadataJewelry(details.metadataHash);
        }

        await fetchAllTransactionDates(window.web3, [...filteredJewelry, ...filteredSelectedGems]);
        await fetchGasDetails([...filteredJewelry, ...filteredSelectedGems]);

      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract, selectedGems]);

  const renderJewelrySelectedGems = () => {
    const gemId = prevGemsArray[currentSelectedGemIndex];
    const selectedGem = selectedGems.find(gem => gem.id == gemId);
    const metadata = pinataMetadataSelected[gemId];

    if (!selectedGem) return null;

    return (
      <div className="card">
        <h2>Details of the processed gemstone</h2>
        {selectedGem.fileURL && (
          <a href={selectedGem.fileURL} target="_blank" rel="noopener noreferrer">
            <img src={selectedGem.fileURL} alt="Gem image" className="details-image" />
          </a>
        )}

        <p><strong>ID:</strong> {selectedGem.id.toString()}</p>
        <p> {selectedGem.replaced ? <strong className="changed">Changed earlier</strong> : <strong>Currently in jewelry</strong> }</p>

        {metadata && (
          <div>
            <p><strong>Gem Type:</strong> {metadata.gemType}</p>
            <p><strong>Size:</strong> {metadata.size}</p>
            <p><strong>Carat:</strong> {metadata.carat} ct</p>
            <p><strong>Color:</strong> {metadata.color}</p>
            <p><strong>Polishing:</strong> {metadata.polishing}</p>
            <p><strong>Transparency:</strong> {metadata.transparency}</p>
            <p><strong>Treatments:</strong> {metadata.treatments}</p>
          </div>
        )}
            <p><strong>Previous gem ID:</strong> {selectedGem.previousGemId.toString()}</p>
        <p><strong>Sale:</strong> {selectedGem.forSale.toString()}</p>
        <p><strong>replaced:</strong> {selectedGem.replaced.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(selectedGem.price.toString(), 'Ether')} Eth</p>

        <button onClick={() => navigate(`/gem-details/${selectedGem.id}`)}>Go to gem details</button>
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
          const gasDetails = transactionGasDetails[event.transactionHash];

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
              {gasDetails && (
                <>
                  <strong>Gas Used:</strong> {gasDetails.gasUsed}
                  <br />
                  <strong>Gas Price:</strong> {window.web3.utils.fromWei(gasDetails.gasPrice, 'ether')} Ether
                  <br />
                  <strong>Total Gas Cost:</strong> {gasDetails.gasCost} Ether
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
  
        {pinataMetadataJewelry && (
          <div>
            <p><strong>Name:</strong> {pinataMetadataJewelry.name}</p>
            <p><strong>Type:</strong> {pinataMetadataJewelry.type}</p>
            <p><strong>Metal:</strong> {pinataMetadataJewelry.metal}</p>
            <p><strong>Size:</strong> {pinataMetadataJewelry.size}</p>
            <p><strong>Additional data:</strong> {pinataMetadataJewelry.additionalData}</p>
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
    </div>
  );
}

export default JewDetails;
