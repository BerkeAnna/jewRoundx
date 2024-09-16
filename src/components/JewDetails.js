import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function JewDetails({ selectedGems, minedGems, jewelry, account, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract }) {
  const { id } = useParams();
  const gemId = id;

  const gemSelected = selectedGems.filter(gem => gem.owner && gem.id == gemId);
  const minedGem = minedGems.filter(gem => gem.owner && gem.id == gemId);
  const jewelryDetails = jewelry.filter(item => item.id == gemId);

  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const [filteredJewelryEvents, setFilteredJewelryEvents] = useState([]);
  const [filteredSelectedGemEvents, setFilteredSelectedGemEvents] = useState([]);
  const [filteredMinedGemEvents, setFilteredMinedGemEvents] = useState([]);
  const [blockDates, setBlockDates] = useState({}); // To store block numbers and their corresponding dates

  // Function to get transaction date from the block number
  const getTransactionDate = async (web3, blockNumber) => {
    const block = await web3.eth.getBlock(blockNumber);
    return new Date(block.timestamp * 1000); // Convert Unix timestamp to a Date object
  };

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        // Jewelry részletek lekérése
        const details = await jewelryContract.methods.getJewelryDetails(id).call();
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId.toString(), 10));
        setPrevGemsArray(gemIdsAsInt);

        // Fetch events
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
        const filteredSelectedGems = selectedGemEvents.filter(event => gemIdsAsInt.includes(parseInt(event.returnValues.id)));
        setFilteredSelectedGemEvents(filteredSelectedGems);

        const minedGemEvents = await gemstoneExtractionContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        const filteredMinedGems = minedGemEvents.filter(event => gemIdsAsInt.includes(parseInt(event.returnValues.id)));
        setFilteredMinedGemEvents(filteredMinedGems);

        // Fetch transaction dates for all events' block numbers
        const allEvents = [...filteredJewelry, ...filteredSelectedGems, ...filteredMinedGems];
        const blockNumbers = allEvents.map(event => event.blockNumber);
        const uniqueBlockNumbers = [...new Set(blockNumbers)]; // Ensure unique block numbers

        const blockDatesMap = {};
        for (let blockNumber of uniqueBlockNumbers) {
          blockDatesMap[blockNumber] = await getTransactionDate(window.web3, blockNumber);
        }
        setBlockDates(blockDatesMap);

      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract]);

  const renderTransactionDetails = (events, gemId) => {
    const gemEvents = events.filter(event => {
      const eventId = parseInt(event.returnValues.id);
      return eventId === parseInt(gemId);
    });

    if (gemEvents.length === 0) {
      return <p>No transaction events found for this item.</p>;
    }

    return (
      <ul className='details-list'>
        {gemEvents.map((event, index) => {
          const { owner, gemCutter, jeweler, newOwner } = event.returnValues;
          const blockNumber = event.blockNumber;
          const transactionDate = blockDates[blockNumber]
            ? blockDates[blockNumber].toLocaleString()
            : 'Loading...';

          return (
            <li key={index} className='details-list-item'>
              <strong>Event:</strong> {event.event}<br />
              <strong>Transaction Hash:</strong> {event.transactionHash}<br />
              <strong>Block Number:</strong> {blockNumber}<br />
              <strong>Transaction Date:</strong> {transactionDate}<br />
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

  const renderMinedGems = () => {
    const filteredMinedGems = minedGems.filter(gem => prevGemsArray.includes(parseInt(gem.id, 10)));
    return filteredMinedGems.map((gem, key) => (
      <div key={key} className="card">
        <h2>Mined Gem Details</h2>
        {gem.fileURL && (
          <div>
            <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={gem.fileURL} alt="Picture" className='details-image' />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {gem.id.toString()}</p>
        <p><strong>Type:</strong> {gem.gemType}</p>
        <p><strong>Details:</strong> {gem.details.toString()}</p>
        <p><strong>Mining Location:</strong> {gem.miningLocation}</p>
        <p><strong>Mining Year:</strong> {gem.miningYear.toString()}</p>
        <p><strong>Extraction Method:</strong> {gem.extractionMethod}</p>
        <p><strong>Selected:</strong> {gem.selected.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Miner:</strong> {gem.owner}</p>

        <hr />
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredMinedGemEvents, gem.id)}
      </div>
    ));
  };

  const renderSelectedGems = () => {
    const filteredSelectedGems = selectedGems.filter(gem => prevGemsArray.includes(parseInt(gem.id, 10)));
    return filteredSelectedGems.map((gem, key) => (
      <div key={key} className="card" >
        <h2>Selected Gem Details</h2>
        {gem.fileURL && (
          <div>
            <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={gem.fileURL} alt="Picture"className='details-image' />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {gem.id.toString()}</p>
        <p><strong>Size:</strong> {gem.size.toString()} mm</p>
        <p><strong>Carat:</strong> {gem.carat.toString()} ct</p>
        <p><strong>Color and gem type:</strong> {gem.colorGemType}</p>
        <p><strong>forSale:</strong> {gem.forSale.toString()}</p>
        <p><strong>Used:</strong> {gem.used.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Gem cutter:</strong> {gem.gemCutter}</p>
        <p><strong>Owner:</strong> {gem.owner}</p>
        <p><strong>previousGemId:</strong> {gem.previousGemId.toString()}</p>

        <hr />
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredSelectedGemEvents, gem.id)}
      </div>
    ));
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
        <p><strong>Metal:</strong> {jewelry.metal}</p>
        <p><strong>Details:</strong> {jewelry.physicalDetails.toString()} mm</p>
        <p><strong>Sale:</strong> {jewelry.sale.toString()}</p>
        <p><strong>Processing:</strong> {jewelry.processing.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(jewelry.price.toString(), 'Ether')} Eth</p>
        <p><strong>Jeweler:</strong> {jewelry.jeweler}</p>
        <p><strong>Owner:</strong> {jewelry.owner}</p>

        <hr />
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredJewelryEvents, jewelry.id)}
      </div>
    ));
  };

  return (
    <div className="details-details-container pt-5">
      <h1>Gem Details</h1>
      <div className="pt-5">
        {renderMinedGems()}
      </div>
      <div className="pt-5">
        {renderSelectedGems()}
      </div>
      <div className="pt-5">
        {renderJewelry()}
      </div>
    </div>
  );
}

export default JewDetails;
