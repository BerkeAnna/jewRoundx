import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/Details.css';
import { ethers } from 'ethers';

function GemDetails({ selectedGems, minedGems, account, gemstoneSelectingContract, gemstoneExtractionContract }) {
  const { id } = useParams(); 
  const gemId = id;

  const [filteredSelectedGemEvents, setFilteredSelectedGemEvents] = useState([]);
  const [filteredMinedGemEvents, setFilteredMinedGemEvents] = useState([]);
  const [blockDates, setBlockDates] = useState({});
  const [transactionGasDetails, setTransactionGasDetails] = useState({});

  const gemSelected = selectedGems.filter(gem => gem.owner && gem.id == gemId);
  const minedGem = minedGems.filter(gem => gem.owner && gem.id == gemId);

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const fetchGasDetails = async (events) => {
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
    if (!gemstoneExtractionContract || !gemstoneSelectingContract) {
      console.error("Contracts are not initialized.");
      return;
    }

    const fetchJewelryDetails = async () => {
      try {
        const gemMiningEvents = await gemstoneExtractionContract.queryFilter("GemMining", 0, "latest");
        const gemPurchasedEvents = await gemstoneExtractionContract.queryFilter("GemPurchased", 0, "latest");
        const gemProcessingEvents = await gemstoneExtractionContract.queryFilter("GemProcessing", 0, "latest");
        const gemSelectedEvents = await gemstoneExtractionContract.queryFilter("GemSelected", 0, "latest");
        const markNewOwnerEvents = await gemstoneExtractionContract.queryFilter("MarkNewOwner", 0, "latest");
        const markGemAsSelectedEvents = await gemstoneExtractionContract.queryFilter("MarkGemAsSelected", 0, "latest");
        const transferGemOwnershipEventsExtraction = await gemstoneExtractionContract.queryFilter("TransferGemOwnership", 0, "latest");

        const minedGemEvents = [
          ...gemMiningEvents,
          ...gemPurchasedEvents,
          ...gemProcessingEvents,
          ...gemSelectedEvents,
          ...markNewOwnerEvents,
          ...markGemAsSelectedEvents,
          ...transferGemOwnershipEventsExtraction
        ];
        setFilteredMinedGemEvents(minedGemEvents);

        const gemSelectingEvents = await gemstoneSelectingContract.queryFilter("GemSelecting", 0, "latest");
        const polishGemEvents = await gemstoneSelectingContract.queryFilter("PolishGem", 0, "latest");
        const markGemAsUsedEvents = await gemstoneSelectingContract.queryFilter("MarkGemAsUsed", 0, "latest");
        const transferGemOwnershipEventsSelecting = await gemstoneSelectingContract.queryFilter("TransferGemOwnership", 0, "latest");

        const selectedGemEvents = [
          ...gemSelectingEvents,
          ...polishGemEvents,
          ...markGemAsUsedEvents,
          ...transferGemOwnershipEventsSelecting,
        ];
        setFilteredSelectedGemEvents(selectedGemEvents);

        await fetchGasDetails([...minedGemEvents, ...selectedGemEvents]);

      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchJewelryDetails();
  }, [gemstoneExtractionContract, gemstoneSelectingContract]);



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
        <p><strong>Price: </strong>{gem.price} Eth</p>
        <p><strong>Miner:</strong> {gem.miner}</p>
        <p><strong>Owner:</strong> {gem.owner}</p>

        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredMinedGemEvents, gem.id, "mined")}
      </div>
    ));
  };

  const renderSelectedGems = () => {
    return gemSelected.map((gem, key) => (
      <div key={key} className="card">
        <h2>Details of the processed gemstone</h2>
        {gem.fileURL && (
          <div>
            <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={gem.fileURL} alt="Picture" className="details-image" />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {gem.id.toString()}</p>
        <p><strong>Size:</strong> {gem.details.size.toString()} mm</p>
        <p><strong>Carat:</strong> {gem.details.carat.toString()} ct</p>
        <p><strong>Type:</strong> {gem.details.gemType.toString()}</p>
        <p><strong>Color:</strong> {gem.details.color.toString()}</p>
        <p><strong>For Sale:</strong> {gem.forSale.toString()}</p>
        <p><strong>Used:</strong> {gem.used.toString()}</p>
        <p><strong>Price: </strong>{gem.price.toString()} Eth</p>
        <p><strong>Gem cutter:</strong> {gem.gemCutter}</p>
        <p><strong>Owner:</strong> {gem.owner}</p>

        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredSelectedGemEvents, gem.id, "selected")}
      </div>
    ));
  };
  const renderTransactionDetails = (events, gemId, type) => {
    const filteredEvents = events.filter(event => {
        if (!event.args) return false;
        if (type === "mined") {
            return event.args.id && event.args.id.toString() === gemId.toString();
        } else if (type === "selected") {
            return event.args.minedGemId && event.args.minedGemId.toString() === gemId.toString();
        }
        return false;
    });

    // Rendezés időrendbe
    const sortedEvents = filteredEvents.sort((a, b) => a.blockNumber - b.blockNumber);

    if (sortedEvents.length === 0) {
        return <p>No transaction events found for this item.</p>;
    }

    return (
        <ul className="details-list">
            {sortedEvents.map((event, index) => {
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

  
  return (
    <div className="details-details-container card-background pt-5">
      <h1>Gem Details</h1>
      <div className=" card-container pt-5">{renderSelectedGems()}</div>
      <div className="card-container pt-5">{renderMinedGems()}</div>
    </div>
  );
}

export default GemDetails;
