import React from 'react';
import { useNavigate } from 'react-router-dom';

function GemMarket({ minedGems, selectedGems, jewelry, account, purchaseGem, sellGem, markGemAsSelected, markGemAsUsed, polishGem }) {
  const navigate = useNavigate();
  const ownedMinedGems = minedGems.filter(minedGem => minedGem.owner !== account);

  const handleMarkAsSelected = (gemId, price) => {
    markGemAsSelected(gemId, price);
    navigate(`/gem-select/${gemId}`);
  };

  const renderSelectedGems = () => {
    return ownedMinedGems.map((minedGem, key) => (
      minedGem.purchased === true && minedGem.selected === false && (
        <div key={key} className="card" style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#FFF7F3', width: '23%', margin: '10px', textAlign: 'center', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
          <img src={minedGem.fileURL} className="card-img-top" alt={`${minedGem.gemType}`} style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '20px' }} />
          <div className="card-body">
            <h5 className="card-title">{minedGem.gemType}</h5>
            <p className="card-text">Price: {window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</p>
            <p className="card-text">Owner: {minedGem.owner}</p>
            <button className="btn btn-primary" onClick={() => handleMarkAsSelected(minedGem.id, minedGem.price)}>
              Select Gem
            </button>
            <button
              className="btn btn-secondary"
              name={minedGem.id}
              value={minedGem.price}
              onClick={(event) => sellGem(event.target.name)}
            >
              Sell
            </button>
          </div>
        </div>
      )
    ));
  };

  return (
    <div className="gem-market">
      <p>&nbsp;</p>
      <h2>Gem market :D</h2>
      <div className="gem-cards">
        {renderSelectedGems()}
      </div>
      <div className='homeButton'>
        <button onClick={() => navigate(`/loggedIn`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default GemMarket;
