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
  const [pinataMetadataJew, setPinataMetadataJew] = useState(null); // Metaadatok
  const [pinataMetadataMined, setpinataMetadataMined] = useState(null); // Metaadatok a bányászott kövekhez
  const [pinataMetadataSelected, setPinataMetadataSelected] = useState(null); // Metaadatok a kiválasztott kövekhez

  const jewelryDetails = jewelry.filter(item => item.id == gemId);
  const gemSelected = selectedGems.filter(gem => gem.owner && gem.id == gemId);
  const minedGem = minedGems.filter(gem => gem.owner && gem.id == gemId);

  const getTransactionDate = async (web3, blockNumber) => {
    const block = await web3.eth.getBlock(blockNumber);
    return new Date(block.timestamp * 1000);
  };

  const fetchPinataMetadataMined = async (hash) => {
    try {
      const cleanedHash = cleanHash(hash); // Hash tisztítás
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

        // Pinata metaadatok lekérése, ha létezik metadataHash
        if (details.metadataHash) {
          await fetchPinataMetadataJew(details.metadataHash);
        }
        
        if (filteredSelectedGems.length > 0 && filteredSelectedGems[0].returnValues.metadataHash) {
          await fetchPinataMetadataForSelected(filteredSelectedGems[0].returnValues.metadataHash);
        }
        
        if (filteredMinedGems.length > 0 && filteredMinedGems[0].returnValues.metadataHash) {
          await fetchPinataMetadataMined(filteredMinedGems[0].returnValues.metadataHash);
        }
        

      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract]);

  const renderJewelrySelectedGems = () => {
    return prevGemsArray.map((gemId) => {
      const selectedGem = selectedGems.find(gem => gem.id == gemId);

      return (
        <div key={gemId} className="card">
          {selectedGem ? (
            <div>
              <h2>Selected Gem Details</h2>
              {pinataMetadataSelected && pinataMetadataSelected.fileUrl && (
                <a href={pinataMetadataSelected.fileUrl} target="_blank" rel="noopener noreferrer">
                  <img src={pinataMetadataSelected.fileUrl} alt="Gem image" className="details-image" />
                </a>
              )}
              <p><strong>ID:</strong> {selectedGem.id.toString()}</p>
              {pinataMetadataSelected && pinataMetadataSelected.fileUrl && (
                <div>
                  <p><strong>Gem Type:</strong> {pinataMetadataSelected.gemType}</p>
                  <p><strong>Size:</strong> {pinataMetadataSelected.size}</p>
                  <p><strong>Carat:</strong> {pinataMetadataSelected.carat}</p>
                  <p><strong>Color:</strong> {pinataMetadataSelected.color}</p>
                </div>
              )}

              <p><strong>forSale:</strong> { selectedGem.forSale.toString() }</p>
              <p><strong>Used:</strong> { selectedGem.used.toString() }</p>
              <p><strong>Price:</strong> { window.web3.utils.fromWei(selectedGem.price.toString(), 'Ether') } Eth</p>
              <p><strong>Gem cutter:</strong> {selectedGem.gemCutter}</p>
              <p><strong>Owner:</strong> {selectedGem.owner}</p>
              <h3>Transaction Details</h3>
              {renderTransactionDetails(filteredSelectedGemEvents, selectedGem.id)}
            </div>
          ) : null}
        </div>
      );
    });
  };

  const renderJewelryMinedGems = () => {
    return prevGemsArray.map((gemId) => {
      const minedGem = minedGems.find(gem => gem.id == gemId);

      return (
        <div key={gemId} className="card">
          {minedGem ? (
            <div>
              <h2>Mined Gem Details</h2>
              {pinataMetadataMined && pinataMetadataMined.fileUrl && (
                <a href={pinataMetadataMined.fileUrl} target="_blank" rel="noopener noreferrer">
                  <img src={pinataMetadataMined.fileUrl} alt="Gem image" className="details-image" />
                </a>
              )}
              <p><strong>ID:</strong> {minedGem.id.toString() }</p>
              {pinataMetadataMined && pinataMetadataMined.fileUrl && (
                <div>
                <p><strong>Gem Type:</strong> {pinataMetadataMined.gemType }</p>
                <p><strong>Weight:</strong> {pinataMetadataMined.weight }</p>
                <p><strong>Size:</strong> {pinataMetadataMined.size}</p>
                <p><strong>Mining Location:</strong> {pinataMetadataMined.miningLocation }</p>
                <p><strong>Mining Year:</strong> {pinataMetadataMined.miningYear }</p>
              </div>
              )}
              <p><strong>Selected:</strong> {minedGem.selected.toString() }</p>
              <p><strong>Price:</strong> { window.web3.utils.fromWei(minedGem.price.toString(), 'Ether') } Eth</p>
              <p><strong>Miner:</strong> {minedGem.miner }</p>
              <p><strong>Owner:</strong> {minedGem.owner }</p>
              <h3>Transaction Details</h3>
              {renderTransactionDetails(filteredMinedGemEvents, minedGem.id)}
            </div>
          ) : null}
        </div>
      );
    });
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
        <p><strong>ID:</strong> { jewelry.id.toString() }</p>
        <p><strong>Name:</strong> { jewelry.name }</p>

        {/* Ha van Pinata metaadat */}
        {pinataMetadataJew && (
          <div>
            <p><strong>Metal:</strong> {pinataMetadataJew.metal}</p>
            <p><strong>Size:</strong> {pinataMetadataJew.size}</p>
            <p><strong>Gem ID:</strong> {pinataMetadataJew.gemId}</p>
          </div>
        )}

        <p><strong>Processing:</strong> { jewelry.processing.toString() }</p>
        <p><strong>Price:</strong> { window.web3.utils.fromWei(jewelry.price.toString(), 'Ether')} Eth</p>
        <p><strong>Jeweler:</strong> {jewelry.jeweler}</p>
        <p><strong>Owner:</strong> { jewelry.owner}</p>
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredJewelryEvents, jewelry.id)}
      </div>
    ));
  };

  return (
    <div className="details-details-container card-background pt-5">
      <h1>Jewelry Details</h1>
      <div className="card-container pt-5">
        {renderJewelry()}
      </div>
      <div className="card-container pt-5">
        {renderJewelrySelectedGems()}
      </div>
      <div className="card-container pt-5">
        {renderJewelryMinedGems()}
      </div>
    </div>
  );
}

export default JewDetails;
