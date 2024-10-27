import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';

function JewDetails({ selectedGems, minedGems, jewelry, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract }) {
  const { id } = useParams();
  const gemId = id;

  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const [filteredJewelryEvents, setFilteredJewelryEvents] = useState([]);
  const [filteredSelectedGemEvents, setFilteredSelectedGemEvents] = useState([]);
  const [filteredMinedGemEvents, setFilteredMinedGemEvents] = useState([]);
  const [blockDates, setBlockDates] = useState({});
  const [pinataMetadataJewelry, setPinataMetadataJewelry] = useState(null); 
  const [pinataMetadataMined, setPinataMetadataMined] = useState({}); 
  const [pinataMetadataSelected, setPinataMetadataSelected] = useState({}); 
  const [transactionGasDetails, setTransactionGasDetails] = useState({});
  const [currentSelectedGemIndex, setCurrentSelectedGemIndex] = useState(0);
  const [currentMinedGemIndex, setCurrentMinedGemIndex] = useState(0);

  const jewelryDetails = jewelry.filter(item => item.id == gemId);

  const getTransactionDate = async (blockNumber) => {
    const block = await ethersProvider.getBlock(blockNumber);
    return new Date(block.timestamp * 1000);
  };
  
  const fetchAllTransactionDates = async (events) => {
    const blockDatePromises = events.map(async (event) => {
      const date = await getTransactionDate(event.blockNumber);
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
      const receipt = await ethersProvider.getTransactionReceipt(event.transactionHash);
      const transaction = await ethersProvider.getTransaction(event.transactionHash);
      const gasUsed = receipt.gasUsed.toNumber();
      const gasPrice = transaction.gasPrice;
      const gasCost = ethers.utils.formatEther(gasUsed * gasPrice);
      return { transactionHash: event.transactionHash, gasUsed, gasPrice: ethers.utils.formatEther(gasPrice), gasCost };
    });

    const gasDetailsResults = await Promise.all(gasDetailsPromises);
    const gasDetailsMap = {};
    gasDetailsResults.forEach(({ transactionHash, gasUsed, gasPrice, gasCost }) => {
      gasDetailsMap[transactionHash] = { gasUsed, gasPrice, gasCost };
    });
    setTransactionGasDetails(gasDetailsMap);
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
        const details = await jewelryContract.getJewelryDetails(id);
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId.toString(), 10));
        setPrevGemsArray(gemIdsAsInt);

        const jewelryEvents = await jewelryContract.queryFilter('allEvents', 0, 'latest');
        const filteredJewelry = jewelryEvents.filter(event => parseInt(event.args.id) === parseInt(id));
        setFilteredJewelryEvents(filteredJewelry);

        const selectedGemEvents = await gemstoneSelectingContract.queryFilter('allEvents', 0, 'latest');
        const filteredSelectedGems = selectedGemEvents.filter(event =>
          gemIdsAsInt.includes(parseInt(event.args.id))
        );
        setFilteredSelectedGemEvents(filteredSelectedGems);

        const minedGemEvents = await gemstoneExtractionContract.queryFilter('allEvents', 0, 'latest');
        const filteredMinedGems = minedGemEvents.filter(event =>
          gemIdsAsInt.includes(parseInt(event.args.id))
        );
        setFilteredMinedGemEvents(filteredMinedGems);

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
          await fetchPinataMetadataJewelry(details.metadataHash);
        }

        await fetchAllTransactionDates([...filteredJewelry, ...filteredSelectedGems, ...filteredMinedGems]);
        await fetchGasDetails([...filteredJewelry, ...filteredSelectedGems, ...filteredMinedGems]);

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
        <p>{selectedGem.replaced ? <strong className="changed">Changed earlier</strong> : <strong>Currently in jewelry</strong>}</p>
        <p><strong>Price:</strong> {ethers.utils.formatEther(selectedGem.price.toString())} Eth</p>
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredSelectedGemEvents, selectedGem.id)}
      </div>
    );
  };

  const renderTransactionDetails = (events, gemId) => {
    const gemEvents = events.filter(event => {
      const eventId = parseInt(event.args.id);
      return eventId === parseInt(gemId);
    });

    if (gemEvents.length === 0) {
      return <p>No transaction events found for this item.</p>;
    }

    return (
      <ul className="no-bullet-list">
        {gemEvents.map((event, index) => {
          const { owner, gemCutter, jeweler, newOwner } = event.args;
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
                  <strong>Gas Price:</strong> {gasDetails.gasPrice} Ether
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

  return (
    <div className="details-details-container card-background pt-5">
      <h1>Jewelry Details</h1>
      <div className="card-container pt-5">
        {renderJewelrySelectedGems()}
      </div>
    </div>
  );
}

export default JewDetails;
