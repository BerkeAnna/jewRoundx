import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Details.css';


function GemDetails({ selectedGems, minedGems, account }) {
  const { id } = useParams();
  const gemId = id;

  const gemSelected = selectedGems.filter(gem => gem.owner && gem.id == gemId);
  const minedGem = minedGems.filter(gem => gem.owner && gem.id == gemId);

  const renderSelectedGems = () => {
    return gemSelected.map((gem, key) => (
      <div key={key} className="details-card" >
        <h2>Selected Gem Details</h2>
        {gem.fileURL && (
          <div>
            <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={gem.fileURL} alt="Picture" className='details-image' />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {gem.id.toString()}</p>
        <p><strong>Size:</strong> {gem.size.toString()}</p>
        <p><strong>Carat:</strong> {gem.carat.toString()}</p>
        <p><strong>Color and gem type:</strong> {gem.colorGemType}</p>
        <p><strong>forSale:</strong> {gem.forSale.toString()}</p>
        <p><strong>Used:</strong> {gem.used.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Jeweler:</strong> {gem.owner}</p>
        <p><strong>Gem cutter:</strong> {gem.gemCutter}</p>
      </div>
    ));
  };

  const renderMinedGems = () => {
    return minedGem.map((gem, key) => (
      <div key={key} className="details-card">
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
        <p><strong>Miner:</strong> {gem.miner}</p>
        <p><strong>Owner:</strong> {gem.owner}</p>

        
      </div>
    ));
  };

  
const renderTransactionDetails = (events, gemId) => {
  const gemEvents = events.filter(event => {
      const eventId = parseInt(event.returnValues.id);  // Convert the BigNumber to a regular number
      return eventId === parseInt(gemId);
  });

  //console.log("Filtered Events for ID:", gemId, gemEvents);  // Ellenőrizze a szűrt eseményeket

  if (gemEvents.length === 0) {
      return <p>No transaction events found for this item.</p>;
  }

  return (
    <ul className='no-bullet-list'>
          {gemEvents.map((event, index) => {
              const { owner, gemCutter, jeweler, newOwner } = event.returnValues;  // Destructure the needed fields

              return (
                  <li key={index} className='details-list-item'>
                    <strong>Event:</strong> {event.event}<br />
                      <strong>Transaction Hash:</strong> {event.transactionHash}<br />
                      <strong>Block Number:</strong> {event.blockNumber}<br />
                      {owner && <div><strong>Owner:</strong> {owner}</div>}
                      {gemCutter && <div><strong>Gem Cutter:</strong> {gemCutter}</div>}
                      {jeweler && <div><strong>Jeweler:</strong> {jeweler}</div>}
                      {newOwner && <div><strong>New Owner:</strong> {newOwner}</div>}
                      {/*<strong>Data:</strong> {JSON.stringify(event.returnValues)}<br />*/}
                  </li>
              );
          })}
      </ul>
  );
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
    </div>
  );
}

export default GemDetails;
