import React from 'react';
import { useNavigate } from 'react-router-dom';

function GemMarket({ minedGems, selectedGems, jewelry, account, purchaseGem, sellGem, markNewOwner, markGemAsUsed, polishGem, transferGemOwnership }) {
  const navigate = useNavigate();
  const gemsForSale = selectedGems.filter(gem => gem.forSale);

  const handleMarkAsSelected = (gemId, price) => {
    transferGemOwnership(gemId, price);
};

  const renderGemsForSale = () => {
    return gemsForSale.map((gem, key) => (
      <div key={key} className="card market-card">
        <img src={gem.fileURL} className="card-img-top card-img-top-market"  />
        <div className="card-body">
          <h5 className="card-title">{gem.gemType}</h5>
          <p className="card-text">Price: {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
          <p className="card-text">Owner: {gem.owner}</p>
          <button className="btn" onClick={() => handleMarkAsSelected(gem.id, gem.price)}>
            Buy
          </button>
          <button className="btn" onClick={() => navigate(`/gem-details/${gem.id}`)}>
            Details
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="gem-market card-background">
      <p>&nbsp;</p>
      <h2>Gem market</h2>
      <div className="gem-cards">
        {renderGemsForSale()}
      </div>
      <div className='homeButton'>
        <button onClick={() => navigate(`/loggedIn`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default GemMarket;
