import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ethers } from 'ethers';

function JewDetails({ selectedGems, minedGems, jewelry, account, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract, getJewelryDetails }) {
  const { id } = useParams();
  const gemId = id;

  const jewelryDetails = jewelry.filter(item => item.id == gemId);

  const [filteredJewelryEvents, setFilteredJewelryEvents] = useState([]);
  const [transactionGasDetails, setTransactionGasDetails] = useState({});
  const [blockDates, setBlockDates] = useState({});

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const getTransactionDate = async (blockNumber) => {
    const block = await provider.getBlock(blockNumber);
    return new Date(block.timestamp * 1000); 
  };
  
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
        // Jewelry Making események szűrése
        const jewelryMakingEvents = await jewelryContract.queryFilter("JewelryMaking", 0, "latest");
        const filteredJewelryMaking = jewelryMakingEvents.filter(event => parseInt(event.args.id) === parseInt(id));
        setFilteredJewelryEvents(filteredJewelryMaking);

        // Gáz és blokkok dátumainak lekérése
        await fetchGasAndDateDetails(jewelryMakingEvents);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract]);

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
              <ul>
                {event.args.owner && (
                  <li><strong>Owner:</strong> {event.args.owner}</li>
                )}
                {event.args.jeweler && (
                  <li><strong>Jeweler:</strong> {event.args.jeweler}</li>
                )}
                {event.args.jewOwner && (
                  <li><strong>Jew Owner:</strong> {event.args.jewOwner}</li>
                )}
                {event.args.miner && (
                  <li><strong>Miner:</strong> {event.args.miner}</li>
                )}
                {event.args.gemCutter && (
                  <li><strong>Gem cutter:</strong> {event.args.gemCutter}</li>
                )}
              </ul>
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

  return (
    <div className="details-container card-background pt-5">
      <h1>Jewelry Details</h1>
      <div className="card-container pt-5">
        {renderJewelry()}
      </div>
    </div>
  );
}

export default JewDetails;
