import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';

function GemDetails({ selectedGems, minedGems, gemstoneSelectingContract, gemstoneExtractionContract }) {
  const { id } = useParams(); // A kő azonosítója
  const gemId = id;

  const [filteredSelectedGemEvents, setFilteredSelectedGemEvents] = useState([]);
  const [filteredMinedGemEvents, setFilteredMinedGemEvents] = useState([]);
  const [blockDates, setBlockDates] = useState({}); // A blokkok időbélyegeit tárolja
  const [pinataMetadataMined, setpinataMetadataMined] = useState(null); // Metaadatok a bányászott kövekhez
  const [pinataMetadataSelected, setPinataMetadataSelected] = useState(null); // Metaadatok a kiválasztott kövekhez
  const [transactionGasDetails, setTransactionGasDetails] = useState({});

  const gemSelected = selectedGems.find(gem => gem.owner && gem.id == gemId);
  const minedGem = minedGems.find(gem => gem.owner && gem.id == gemId);

  // Dátum lekérése blokkszám alapján
  const getTransactionDate = async (blockNumber) => {
    const block = await gemstoneExtractionContract.provider.getBlock(blockNumber);
    return new Date(block.timestamp * 1000); // Unix timestamp átalakítása dátummá
  };

  // Pinata metaadatok lekérése
  const fetchPinataMetadataMined = async (hash) => {
    try {
      const cleanedHash = cleanHash(hash);
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setpinataMetadataMined(data);
    } catch (error) {
      console.error('Error fetching Pinata metadata:', error);
    }
  };

  const fetchPinataMetadataForSelected = async (hash) => {
    try {
      const cleanedHash = cleanHash(hash);
      const url = `https://gateway.pinata.cloud/ipfs/${cleanedHash}`;
      const response = await fetch(url);
      const data = await response.json();
      setPinataMetadataSelected(data);
    } catch (error) {
      console.error('Error fetching Pinata metadata for selected gems:', error);
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
    const fetchGemDetails = async () => {
      try {
        // Kiválasztott gem események lekérése
        const selectedGemEvents = await gemstoneSelectingContract.queryFilter(gemstoneSelectingContract.filters.allEvents(), 0, "latest");
        const filteredSelectedGems = selectedGemEvents.filter(event => parseInt(event.args.id) === parseInt(gemId));
        setFilteredSelectedGemEvents(filteredSelectedGems);

        // Bányászott gem események lekérése
        const minedGemEvents = await gemstoneExtractionContract.queryFilter(gemstoneExtractionContract.filters.allEvents(), 0, "latest");
        const filteredMinedGems = minedGemEvents.filter(event => parseInt(event.args.id) === parseInt(gemId));
        setFilteredMinedGemEvents(filteredMinedGems);

        // Pinata metaadatok lekérése, ha létezik metadataHash
        if (gemSelected && gemSelected.metadataHash) {
          await fetchPinataMetadataForSelected(gemSelected.metadataHash);
        }

        if (minedGem && minedGem.metadataHash) {
          await fetchPinataMetadataMined(minedGem.metadataHash);
        }

        // Tranzakciók blokkjainak dátumainak és gázadatainak lekérése
        const allEvents = [...filteredSelectedGems, ...filteredMinedGems];
        const gasDetailsPromises = allEvents.map(async (event) => {
          const date = await getTransactionDate(event.blockNumber);
          const receipt = await gemstoneExtractionContract.provider.getTransactionReceipt(event.transactionHash);
          const transaction = await gemstoneExtractionContract.provider.getTransaction(event.transactionHash);
          const gasUsed = receipt.gasUsed.toString();
          const gasPrice = transaction.gasPrice.toString();
          const gasCost = ethers.utils.formatEther(gasUsed * gasPrice);
          return { blockNumber: event.blockNumber, date, transactionHash: event.transactionHash, gasUsed, gasPrice, gasCost };
        });

        const gasDetailsResults = await Promise.all(gasDetailsPromises);

        const blockDateMap = {};
        const gasDetailsMap = {};
        gasDetailsResults.forEach(({ blockNumber, date, transactionHash, gasUsed, gasPrice, gasCost }) => {
          blockDateMap[blockNumber] = date;
          gasDetailsMap[transactionHash] = { gasUsed, gasPrice, gasCost };
        });

        setBlockDates(blockDateMap);
        setTransactionGasDetails(gasDetailsMap);

      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchGemDetails();
  }, [gemId, gemstoneSelectingContract, gemstoneExtractionContract, gemSelected, minedGem]);

  const renderSelectedGemDetails = () => {
    if (!gemSelected) {
      return <p>No selected gem details found.</p>;
    }

    return (
      <div className="card">
        <h2>Selected Gem Details</h2>
        {pinataMetadataSelected && pinataMetadataSelected.fileUrl && (
          <a href={pinataMetadataSelected.fileUrl} target="_blank" rel="noopener noreferrer">
            <img src={pinataMetadataSelected.fileUrl} alt="Gem image" className="details-image" />
          </a>
        )}
        <p><strong>ID:</strong> {gemSelected.id.toString()}</p>
        {pinataMetadataSelected && (
          <div>
            <p><strong>Gem Type:</strong> {pinataMetadataSelected.gemType}</p>
            <p><strong>Size:</strong> {pinataMetadataSelected.size}</p>
            <p><strong>Carat:</strong> {pinataMetadataSelected.carat} ct</p>
            <p><strong>Color:</strong> {pinataMetadataSelected.color}</p>
            <p><strong>Polishing:</strong> {pinataMetadataSelected.polishing}</p>
            <p><strong>Transparency:</strong> {pinataMetadataSelected.transparency}</p>
            <p><strong>Treatments:</strong> {pinataMetadataSelected.treatments}</p>
          </div>
        )}
        <p><strong>Price:</strong> {ethers.utils.formatEther(gemSelected.price.toString())} Eth</p>
        <p><strong>replaced:</strong> {gemSelected.replaced.toString()}</p>
        <p><strong>Gem cutter:</strong> {gemSelected.gemCutter}</p>
        <p><strong>Owner:</strong> {gemSelected.owner}</p>
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredSelectedGemEvents, gemSelected.id)}
      </div>
    );
  };

  const renderMinedGemDetails = () => {
    if (!minedGem) {
      return <p>No mined gem details found.</p>;
    }

    return (
      <div className="card">
        <h2>Mined Gem Details</h2>
        {pinataMetadataMined && pinataMetadataMined.fileUrl && (
          <a href={pinataMetadataMined.fileUrl} target="_blank" rel="noopener noreferrer">
            <img src={pinataMetadataMined.fileUrl} alt="Gem image" className="details-image" />
          </a>
        )}
        <p><strong>ID:</strong> {minedGem.id.toString()}</p>
        {pinataMetadataMined && (
          <div>
            <p><strong>Gem Type:</strong> {pinataMetadataMined.gemType}</p>
            <p><strong>Weight:</strong> {pinataMetadataMined.weight}</p>
            <p><strong>Size:</strong> {pinataMetadataMined.size}</p>
            <p><strong>Mining Location:</strong> {pinataMetadataMined.miningLocation}</p>
            <p><strong>Mining Year:</strong> {pinataMetadataMined.miningYear}</p>
          </div>
        )}
        <p><strong>Price:</strong> {ethers.utils.formatEther(minedGem.price.toString())} Eth</p>
        <p><strong>Miner:</strong> {minedGem.miner}</p>
        <p><strong>Owner:</strong> {minedGem.owner}</p>
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredMinedGemEvents, minedGem.id)}
      </div>
    );
  };

  const renderTransactionDetails = (events, gemId) => {
    const gemEvents = events.filter(event => {
      const eventId = parseInt(event.args.id);
      return eventId === parseInt(gemId);
    });

    if (gemEvents.length === 0) {
      return <p>No transaction events found for this gem.</p>;
    }

    return (
      <ul className="no-bullet-list">
        {gemEvents.map((event, index) => {
          const { owner, gemCutter, newOwner } = event.args;
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
                  <strong>Gas Price:</strong> {ethers.utils.formatEther(gasDetails.gasPrice)} Ether
                  <br />
                  <strong>Total Gas Cost:</strong> {gasDetails.gasCost} Ether
                </>
              )}
              <br />
              {owner && <div><strong>Owner:</strong> {owner}</div>}
              {gemCutter && <div><strong>Gem Cutter:</strong> {gemCutter}</div>}
              {newOwner && <div><strong>New Owner:</strong> {newOwner}</div>}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="details-details-container card-background pt-5">
      <h1>Gem Details</h1>
      <div className="card-container pt-5">
        {renderSelectedGemDetails()}
      </div>
      <div className="card-container pt-5">
        {renderMinedGemDetails()}
      </div>
    </div>
  );
}

export default GemDetails;
