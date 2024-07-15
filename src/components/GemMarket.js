import React from 'react';
import { useNavigate } from 'react-router-dom';

function GemMarket({ minedGems, selectedGems, jewelry, account, purchaseGem, sellGem, markGemAsSelected, markGemAsUsed, polishGem, transferGemOwnership }) {
  const navigate = useNavigate();
  const gemsForSale = selectedGems.filter(gem => gem.forSale);

  const handleMarkAsSelected = (gemId) => {
    transferGemOwnership(gemId);
    navigate(`/gem-select/${gemId}`);
};


  const renderGemsForSale = () => {
    return gemsForSale.map((gem, key) => (
      <div key={key} className="card" style={{ width: '30%', marginBottom: '20px', padding: '20px', backgroundColor: '#FFF7F3', margin: '10px', textAlign: 'center', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
        <img src={gem.fileURL} className="card-img-top" alt={`${gem.gemType}`} style={{ width: '100%', height: '150px', objectFit: 'contain', marginTop: '20px' }} />
        <div className="card-body">
          <h5 className="card-title">{gem.gemType}</h5>
          <p className="card-text">Price: {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
          <p className="card-text">Owner: {gem.owner}</p>
          <button className="btn btn-primary" onClick={() => handleMarkAsSelected(gem.id, gem.price)}>
            Select Gem
          </button>
          <button
            className="btn btn-secondary"
            name={gem.id}
            value={gem.price}
            onClick={(event) => sellGem(event.target.name)}
          >
            Sell
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(`/gem-details/${gem.id}`)}>
            Details
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="gem-market">
      <p>&nbsp;</p>
      <h2>Gem market</h2>
      <div className="gem-cards" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {renderGemsForSale()}
      </div>
      <div className='homeButton'>
        <button onClick={() => navigate(`/loggedIn`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default GemMarket;
