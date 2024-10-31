import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';

function JewDetails({ selectedGems, minedGems, jewelry, account, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract, getJewelryDetails }) {
  const { id } = useParams();
  const gemId = id;

  const jewelryDetails = jewelry.filter(item => item.id == gemId);
  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const [filteredJewelryEvents, setFilteredJewelryEvents] = useState([]);
  const [filteredSelectedGemEvents, setFilteredSelectedGemEvents] = useState([]);
  const [filteredMinedGemEvents, setFilteredMinedGemEvents] = useState([]);
  const [transactionGasDetails, setTransactionGasDetails] = useState({});
  const [blockDates, setBlockDates] = useState({});
  const [currentGemIndex, setCurrentGemIndex] = useState(0);

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const fetchGasAndDateDetails = async (events) => {
    const gasDetailsMap = {};
    const blockDatesMap = {};

    for (let event of events) {
      const receipt = await provider.getTransactionReceipt(event.transactionHash);
      const transaction = await provider.getTransaction(event.transactionHash);
      gasDetailsMap[event.transactionHash] = {
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: ethers.utils.formatEther(transaction.gasPrice),
      };
      const block = await provider.getBlock(event.blockNumber);
      blockDatesMap[event.blockNumber] = new Date(block.timestamp * 1000);
    }

    setTransactionGasDetails(gasDetailsMap);
    setBlockDates(blockDatesMap);
  };

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const details = await jewelryContract.getJewelryDetails(id);
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId.toString(), 10));
        setPrevGemsArray(gemIdsAsInt);

        const jewelryEvents = await jewelryContract.queryFilter("JewelryMaking", 0, "latest");
        const jewelryBoughtEvents = await jewelryContract.queryFilter("JewelryBought", 0, "latest");
        const gemUpdatedEvents = await jewelryContract.queryFilter("GemUpdated", 0, "latest");
        const gemReplacedEvents = await jewelryContract.queryFilter("GemReplaced", 0, "latest");
        const jewelryFinishedEvents = await jewelryContract.queryFilter("JewelryFinished", 0, "latest");
        const jewelrySaleEvents = await jewelryContract.queryFilter("JewelrySale", 0, "latest");
        const jewelryAddRepairEvents = await jewelryContract.queryFilter("JewelryAddRepair", 0, "latest");
        const returnToJewOwnerEvents = await jewelryContract.queryFilter("ReturnToJewOwner", 0, "latest");

        // Filter events for this jewelry item by ID
        const filteredJewelryMaking = jewelryEvents.filter(event => parseInt(event.args.id) === parseInt(id));
        const filteredJewelryBought = jewelryBoughtEvents.filter(event => parseInt(event.args.id) === parseInt(id));
        const filteredGemUpdated = gemUpdatedEvents.filter(event => parseInt(event.args.jewelryId || event.args.id) === parseInt(id));
        const filteredGemReplaced = gemReplacedEvents.filter(event => parseInt(event.args.jewelryId || event.args.id) === parseInt(id));
        const filteredJewelryFinished = jewelryFinishedEvents.filter(event => parseInt(event.args.id) === parseInt(id));
        const filteredJewelrySale = jewelrySaleEvents.filter(event => parseInt(event.args.id) === parseInt(id));
        const filteredJewelryAddRepair = jewelryAddRepairEvents.filter(event => parseInt(event.args.id) === parseInt(id));
        const filteredReturnToJewOwner = returnToJewOwnerEvents.filter(event => parseInt(event.args.id) === parseInt(id));

        const allEvents = [
          ...filteredJewelryMaking,
          ...filteredJewelryBought,
          ...filteredGemUpdated,
          ...filteredGemReplaced,
          ...filteredJewelryFinished,
          ...filteredJewelrySale,
          ...filteredJewelryAddRepair,
          ...filteredReturnToJewOwner
        ];

        setFilteredJewelryEvents(allEvents);
        await fetchGasAndDateDetails(allEvents);

        const selectedGemEvents = await gemstoneSelectingContract.queryFilter("allEvents", 0, "latest");
        const filteredSelectedGems = selectedGemEvents.filter(event => gemIdsAsInt.includes(parseInt(event.args.id)));
        setFilteredSelectedGemEvents(filteredSelectedGems);
        
        const minedGemEvents = await gemstoneExtractionContract.queryFilter("allEvents", 0, "latest");
        const filteredMinedGems = minedGemEvents.filter(event => gemIdsAsInt.includes(parseInt(event.args.id)));
        setFilteredMinedGemEvents(filteredMinedGems);

      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract]);

  const renderTransactionDetails = (events) => {
    if (events.length === 0) {
      return <p>No transaction events found for this item.</p>;
    }

    return (
      <ul className="details-list">
        {events.map((event, index) => {
          const gasDetails = transactionGasDetails[event.transactionHash];
          const transactionDate = blockDates[event.blockNumber]
            ? blockDates[event.blockNumber].toLocaleString()
            : 'Loading...';

          return (
            <li key={index} className="details-list-item">
              <strong>Event:</strong> {event.event}
              <br />
              <strong>Transaction Hash:</strong> {event.transactionHash}
              <br />
              <strong>Block Number:</strong> {event.blockNumber}
              <br />
              <strong>Transaction Date:</strong> {transactionDate}
              <br />
              {gasDetails && (
                <>
                  <strong>Gas Used:</strong> {gasDetails.gasUsed}
                  <br />
                  <strong>Gas Price:</strong> {gasDetails.gasPrice} Ether
                  <br />
                </>
              )}
              <strong>Involved Users:</strong>
              <p>
                {event.args.owner && <li><strong>Owner:</strong> {event.args.owner}</li>}
                {event.args.jeweler && <li><strong>Jeweler:</strong> {event.args.jeweler}</li>}
                {event.args.jewOwner && <li><strong>Jew Owner:</strong> {event.args.jewOwner}</li>}
                {event.args.miner && <li><strong>Miner:</strong> {event.args.miner}</li>}
                {event.args.gemCutter && <li><strong>Gem cutter:</strong> {event.args.gemCutter}</li>}
              </p>
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
        <p><strong>Price:</strong> {jewelry.price.toString()} Eth</p>
        <p><strong>Details:</strong> {jewelry.physicalDetails.toString()}</p>
        <p><strong>Jeweler:</strong> {jewelry.jeweler}</p>
        <p><strong>Owner:</strong> {jewelry.owner}</p>
        <hr />
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredJewelryEvents)}
      </div>
    ));
  };

  const renderMinedGems = () => {
    const filteredMinedGems = minedGems.filter(gem => prevGemsArray.includes(parseInt(gem.id, 10))).reverse();
    if (filteredMinedGems.length === 0) {
      return <p>No Mined Gems Available</p>;
    }

    return filteredMinedGems.map((gem, key) => (
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
        <p><strong>Price:</strong> {gem.price.toString()} Eth</p>
        <p><strong>Details:</strong> {gem.details.toString()}</p>
        <p><strong>Mining Location:</strong> {gem.miningLocation}</p>
        <p><strong>Mining Year:</strong> {gem.miningYear.toString()}</p>
        <p><strong>Selected:</strong> {gem.selected.toString()}</p>
        <p><strong>Miner:</strong> {gem.owner}</p>
        <hr />
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredMinedGemEvents)}
      </div>
    ));
  };

  const renderSelectedGems = () => {
    const filteredSelectedGems = selectedGems.filter(gem => prevGemsArray.includes(parseInt(gem.id, 10))).reverse();
    if (filteredSelectedGems.length === 0) {
      return <p>No Selected Gems Available</p>;
    }

    return filteredSelectedGems.map((gem, key) => (
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
        <p>{gem.replaced ? <strong className="changed">Changed earlier</strong> : <strong>Currently in jewelry</strong>}</p>
        <p><strong>Price:</strong> {gem.price.toString()} Eth</p>
        <p><strong>Size:</strong> {gem.details.size.toString()}</p>
        <p><strong>Carat:</strong> {gem.details.carat.toString()}</p>
        <p><strong>Type:</strong> {gem.details.gemType.toString()}</p>
        <p><strong>Color:</strong> {gem.details.color.toString()}</p>
        <p><strong>forSale:</strong> {gem.forSale.toString()}</p>
        <p><strong>Used:</strong> {gem.used.toString()}</p>
        <p><strong>Gem cutter:</strong> {gem.gemCutter}</p>
        <p><strong>Owner:</strong> {gem.owner}</p>
        <p><strong>Previous gem ID:</strong> {gem.previousGemId.toString()}</p>
        <hr />
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredSelectedGemEvents)}
      </div>
    ));
  };

  return (
    <div className="details-details-container card-background pt-5">
      <h1>Jewelry Details</h1>
      <div className="card-container pt-5">
        {renderJewelry()}
      </div>
      <div className="details-row pt-5">
        <span className="arrow" onClick={() => setCurrentGemIndex(currentGemIndex === 0 ? minedGems.length - 1 : currentGemIndex - 1)}>
          ←
        </span>
        <div className="card-container">
          {renderMinedGems()[currentGemIndex]}
        </div>
        <span className="arrow" onClick={() => setCurrentGemIndex((currentGemIndex + 1) % minedGems.length)}>
          →
        </span>
      </div>
      <div className="details-row">
        <span className="arrow" onClick={() => setCurrentGemIndex(currentGemIndex === 0 ? selectedGems.length - 1 : currentGemIndex - 1)}>
          ←
        </span>
        <div className="card-container pt-5">
          {renderSelectedGems()[currentGemIndex]}
        </div>
        <span className="arrow" onClick={() => setCurrentGemIndex((currentGemIndex + 1) % selectedGems.length)}>
          →
        </span>
      </div>
    </div>
  );
}

export default JewDetails;
