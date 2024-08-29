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

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const details = await jewelryContract.methods.getJewelryDetails(id).call();
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId.toString(), 10));
        setPrevGemsArray(gemIdsAsInt);

        console.log("Jewelry Details:", details);

        // Jewelry szerződés eseményeinek lekérdezése
        const jewelryEvents = await jewelryContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });

        const filteredJewelry = jewelryEvents.filter(event => {
          const returnValues = event.returnValues;
          return parseInt(returnValues.id) === parseInt(id);
        });

        console.log("Jewelry Events:", filteredJewelry);  // Ellenőrizze az eseményeket a konzolban
        setFilteredJewelryEvents(filteredJewelry);

        // GemstoneSelecting szerződés eseményeinek lekérdezése
        const selectedGemEvents = await gemstoneSelectingContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });

        const filteredSelectedGems = selectedGemEvents.filter(event => {
          const returnValues = event.returnValues;
          return parseInt(returnValues.id) === parseInt(id);
        });

        console.log("Selected Gem Events:", filteredSelectedGems);  // Ellenőrizze az eseményeket a konzolban
        setFilteredSelectedGemEvents(filteredSelectedGems);

        // GemstoneExtraction szerződés eseményeinek lekérdezése
        const minedGemEvents = await gemstoneExtractionContract.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        });

        const filteredMinedGems = minedGemEvents.filter(event => {
          const returnValues = event.returnValues;
          return parseInt(returnValues.id) === parseInt(id);
        });

        console.log("Mined Gem Events:", filteredMinedGems);  // Ellenőrizze az eseményeket a konzolban
        setFilteredMinedGemEvents(filteredMinedGems);

      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract, gemstoneSelectingContract, gemstoneExtractionContract]);

  const cardStyle = {
    marginBottom: '20px',
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#FFF7F3',
    width: '80%',
    margin: 'auto',
    textAlign: 'center',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
  };

  const renderSelectedGems = () => {
    const filteredSelectedGems = selectedGems.filter(gem => prevGemsArray.includes(parseInt(gem.id, 10)));

    return filteredSelectedGems.map((gem, key) => (
      <div key={key} className="card" style={cardStyle}>
        <h2>Selected Gem Details</h2>
        {gem.fileURL && (
          <div>
            <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={gem.fileURL} alt="Feltöltött kép" style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '20px' }} />
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

        {/* Események megjelenítése */}
        <hr />
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredSelectedGemEvents, gem.id)}
      </div>
    ));
  };

  const renderMinedGems = () => {
    const filteredMinedGems = minedGems.filter(gem => prevGemsArray.includes(parseInt(gem.id, 10)));

    return filteredMinedGems.map((gem, key) => (
        <div key={key} className="card" style={cardStyle}>
            <h2>Mined Gem Details</h2>
            {gem.fileURL && (
                <div>
                    <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
                        <img src={gem.fileURL} alt="Feltöltött kép" style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '20px' }} />
                    </a>
                </div>
            )}
            <p><strong>ID:</strong> {gem.id.toString()}</p>
            <p><strong>Type:</strong> {gem.gemType}</p>
            <p><strong>Weight:</strong> {gem.weight.toString()} mm</p>
            <p><strong>Size:</strong> {gem.size.toString()} mm</p>
            <p><strong>Mining Location:</strong> {gem.miningLocation}</p>
            <p><strong>Mining Year:</strong> {gem.miningYear.toString()}</p>
            <p><strong>Extraction Method:</strong> {gem.extractionMethod}</p>
            <p><strong>Selected:</strong> {gem.selected.toString()}</p>
            <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
            <p><strong>Miner:</strong> {gem.owner}</p>

            {/* Események megjelenítése */}
            <hr />
            <h3>Transaction Details</h3>
            {renderTransactionDetails(filteredMinedGemEvents, gem.id)}
        </div>
    ));
};


  const renderJewelry = () => {
    return jewelryDetails.map((jewelry, key) => (
      <div key={key} className="card" style={cardStyle}>
        <h2>Jewelry Details</h2>
        {jewelry.fileURL && (
          <div>
            <a href={jewelry.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={jewelry.fileURL} alt="Jewelry" style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '20px' }} />
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

        {/* Események megjelenítése */}
        <hr />
        <h3>Transaction Details</h3>
        {renderTransactionDetails(filteredJewelryEvents, jewelry.id)}
      </div>
    ));
  };

  const renderTransactionDetails = (events, gemId) => {
    const gemEvents = events.filter(event => parseInt(event.returnValues.id) === parseInt(gemId));

    console.log("Filtered Events for ID:", gemId, gemEvents);  // Ellenőrizze a szűrt eseményeket

    if (gemEvents.length === 0) {
        return <p>No transaction events found for this item.</p>;
    }

    return (
        <ul>
            {gemEvents.map((event, index) => (
                <li key={index}>
                    <strong>Event:</strong> {event.event}<br />
                    <strong>Transaction Hash:</strong> {event.transactionHash}<br />
                    <strong>Block Number:</strong> {event.blockNumber}<br />
                    <strong>Data:</strong> {JSON.stringify(event.returnValues)}
                </li>
            ))}
        </ul>
    );
};


  return (
    <div className="pt-5" style={{ maxWidth: '1200px', margin: 'auto' }}>
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
