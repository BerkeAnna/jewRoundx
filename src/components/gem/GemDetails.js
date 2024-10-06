import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/Details.css';

function GemDetails({ selectedGems, minedGems, account, gemstoneSelectingContract, gemstoneExtractionContract }) {
  const { id } = useParams(); 
  const gemId = id;

  const [filteredSelectedGemEvents, setFilteredSelectedGemEvents] = useState([]);
  const [filteredMinedGemEvents, setFilteredMinedGemEvents] = useState([]);
  const [blockDates, setBlockDates] = useState({});

  const gemSelected = selectedGems.filter(gem => gem.owner && gem.id == gemId);
  const minedGem = minedGems.filter(gem => gem.owner && gem.id == gemId);

  const getTransactionDate = async (web3, blockNumber) => {
    const block = await web3.eth.getBlock(blockNumber);
    return new Date(block.timestamp * 1000); 
  };

  useEffect(() => {
    const fetchGemDetails = async () => {
      try {
        const gemEvents = await gemstoneSelectingContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest',
        });
        const filteredSelectedGems = gemEvents.filter(event => parseInt(event.returnValues.id) === parseInt(id));
        setFilteredSelectedGemEvents(filteredSelectedGems);

        const minedGemEvents = await gemstoneExtractionContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest',
        });
        const filteredMinedGems = minedGemEvents.filter(event => parseInt(event.returnValues.id) === parseInt(id));
        setFilteredMinedGemEvents(filteredMinedGems);

        const allEvents = [...filteredSelectedGems, ...filteredMinedGems];
        const blockNumbers = allEvents.map(event => event.blockNumber);
        const uniqueBlockNumbers = [...new Set(blockNumbers)];

        const blockDatesMap = {};
        for (let blockNumber of uniqueBlockNumbers) {
          blockDatesMap[blockNumber] = await getTransactionDate(window.web3, blockNumber);
        }
        setBlockDates(blockDatesMap);

      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchGemDetails();
  }, [id, gemstoneSelectingContract, gemstoneExtractionContract]);

  const renderSelectedGems = () => {
    return gemSelected.map((gem, key) => (
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
        <p><strong>Size:</strong> {gem.size.toString()}</p>
        <p><strong>Carat:</strong> {gem.carat.toString()}</p>
        <p><strong>Details:</strong> {gem.colorGemType}</p>
        <p><strong>forSale:</strong> {gem.forSale.toString()}</p>
        <p><strong>Used:</strong> {gem.used.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Gem cutter:</strong> {gem.gemCutter}</p>
        <p><strong>Owner:</strong> {gem.owner}</p>

        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredSelectedGemEvents, gem.id)}
      </div>
    ));
  };

  const renderMinedGems = () => {
    return minedGem.map((gem, key) => (
      <div key={key} className="card">
        <h2>Mined Gem Details</h2>
        {gem.fileURL && (
          <div>
            <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={gem.fileURL} alt="Picture" className="details-image" />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {gem.id.toString()}</p>
        <p><strong>Type:</strong> {gem.gemType}</p>
        <p><strong>Details:</strong> {gem.details.toString()}</p>
        <p><strong>Mining Location:</strong> {gem.miningLocation}</p>
        <p><strong>Mining Year:</strong> {gem.miningYear.toString()}</p>
        <p><strong>Selected:</strong> {gem.selected.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Miner:</strong> {gem.miner}</p>
        <p><strong>Owner:</strong> {gem.owner}</p>

        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredMinedGemEvents, gem.id)}
      </div>
    ));
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

  return (
    <div className="details-details-container card-background pt-5">
      <h1>Gem Details</h1>
      <div className="card-container pt-5">{renderMinedGems()}</div>
      <div className=" card-container pt-5">{renderSelectedGems()}</div>
    </div>
  );
}

export default GemDetails;
