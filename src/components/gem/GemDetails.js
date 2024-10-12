import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../../firebase'; // Firebase Firestore import
import { doc, getDoc } from 'firebase/firestore'; // Firestore lekérdezéshez

function GemDetails({ selectedGems, minedGems, gemstoneSelectingContract, gemstoneExtractionContract }) {
  const { id } = useParams(); // A kő azonosítója
  const gemId = id;

  const [filteredSelectedGemEvents, setFilteredSelectedGemEvents] = useState([]);
  const [filteredMinedGemEvents, setFilteredMinedGemEvents] = useState([]);
  const [blockDates, setBlockDates] = useState({});
  const [firestoreMetadataMined, setFirestoreMetadataMined] = useState(null);
  const [firestoreMetadataSelected, setFirestoreMetadataSelected] = useState(null);
  const [transactionGasDetails, setTransactionGasDetails] = useState({}); // Gáz adatok tárolása

  const gemSelected = selectedGems.find(gem => gem.owner && gem.id == gemId);
  const minedGem = minedGems.find(gem => gem.owner && gem.id == gemId);

  // Dátum lekérése blokkszám alapján
  const getTransactionDate = async (blockNumber) => {
    const block = await window.web3.eth.getBlock(blockNumber);
    return new Date(block.timestamp * 1000); // Unix timestamp átalakítása dátummá
  };

  // Firestore metaadatok lekérése
  const fetchFirestoreMetadataMined = async (docId) => {
    try {
      const docRef = doc(firestore, 'minedGems', docId); // Lekérjük a Firestore dokumentumot
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFirestoreMetadataMined(docSnap.data());
      } else {
        console.error('No such document for mined gem metadata');
      }
    } catch (error) {
      console.error('Error fetching Firestore metadata for mined gems:', error);
    }
  };

  const fetchFirestoreMetadataSelected = async (docId) => {
    try {
      const docRef = doc(firestore, 'gems', docId); // Lekérjük a Firestore dokumentumot
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFirestoreMetadataSelected(docSnap.data());
      } else {
        console.error('No such document for selected gem metadata');
      }
    } catch (error) {
      console.error('Error fetching Firestore metadata for selected gems:', error);
    }
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

  useEffect(() => {
    const fetchGemDetails = async () => {
      try {
        // Kiválasztott gem események lekérése
        const selectedGemEvents = await gemstoneSelectingContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        const filteredSelectedGems = selectedGemEvents.filter(event => parseInt(event.returnValues.id) === parseInt(gemId));
        setFilteredSelectedGemEvents(filteredSelectedGems);

        // Bányászott gem események lekérése
        const minedGemEvents = await gemstoneExtractionContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        const filteredMinedGems = minedGemEvents.filter(event => parseInt(event.returnValues.id) === parseInt(gemId));
        setFilteredMinedGemEvents(filteredMinedGems);

        // Firestore metaadatok lekérése, ha létezik metadataHash
        if (gemSelected && gemSelected.metadataHash) {
          await fetchFirestoreMetadataSelected(gemSelected.metadataHash); 
        }

        if (minedGem && minedGem.metadataHash) {
          await fetchFirestoreMetadataMined(minedGem.metadataHash); 
        }

        // Tranzakciók blokkjainak dátumainak és gáz adatainak lekérése
        const allEvents = [...filteredSelectedGems, ...filteredMinedGems];
        const blockDatePromises = allEvents.map(async (event) => {
          const date = await getTransactionDate(event.blockNumber);
          return { blockNumber: event.blockNumber, date };
        });
        const blockDateResults = await Promise.all(blockDatePromises);

        const blockDateMap = {};
        blockDateResults.forEach(({ blockNumber, date }) => {
          blockDateMap[blockNumber] = date;
        });
        setBlockDates(blockDateMap);

        await fetchGasDetails(allEvents);

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
        {firestoreMetadataSelected && firestoreMetadataSelected.fileUrl && (
          <a href={firestoreMetadataSelected.fileUrl} target="_blank" rel="noopener noreferrer">
            <img src={firestoreMetadataSelected.fileUrl} alt="Gem image" className="details-image" />
          </a>
        )}
        <p><strong>ID:</strong> {gemSelected.id.toString()}</p>
        {firestoreMetadataSelected && (
          <div>
            <p><strong>Gem Type:</strong> {firestoreMetadataSelected.gemType}</p>
            <p><strong>Size:</strong> {firestoreMetadataSelected.size}</p>
            <p><strong>Carat:</strong> {firestoreMetadataSelected.carat} ct</p>
            <p><strong>Color:</strong> {firestoreMetadataSelected.color}</p>
            <p><strong>Polishing:</strong> {firestoreMetadataSelected.polishing}</p>
            <p><strong>Transparency:</strong> {firestoreMetadataSelected.transparency}</p>
            <p><strong>Treatments:</strong> {firestoreMetadataSelected.treatments}</p>
          </div>
        )}
        <p><strong>Price:</strong> {window.web3.utils.fromWei(gemSelected.price.toString(), 'Ether')} Eth</p>
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
        {firestoreMetadataMined && firestoreMetadataMined.fileUrl && (
          <a href={firestoreMetadataMined.fileUrl} target="_blank" rel="noopener noreferrer">
            <img src={firestoreMetadataMined.fileUrl} alt="Gem image" className="details-image" />
          </a>
        )}
        <p><strong>ID:</strong> {minedGem.id.toString()}</p>
        {firestoreMetadataMined && (
          <div>
            <p><strong>Gem Type:</strong> {firestoreMetadataMined.gemType}</p>
            <p><strong>Weight:</strong> {firestoreMetadataMined.weight}</p>
            <p><strong>Size:</strong> {firestoreMetadataMined.size}</p>
            <p><strong>Mining Location:</strong> {firestoreMetadataMined.miningLocation}</p>
            <p><strong>Mining Year:</strong> {firestoreMetadataMined.miningYear}</p>
          </div>
        )}
        <p><strong>Price:</strong> {window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Miner:</strong> {minedGem.miner}</p>
        <p><strong>Owner:</strong> {minedGem.owner}</p>
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
      return <p>No transaction events found for this gem.</p>;
    }

    return (
      <ul className="no-bullet-list">
        {gemEvents.map((event, index) => {
          const { owner, gemCutter, newOwner } = event.returnValues;
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
