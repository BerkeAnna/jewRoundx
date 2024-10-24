import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Market.css';

function MinedGemMarket({ minedGems, selectedGems, jewelry, account, purchaseGem, sellGem, markNewOwner, markGemAsUsed, polishGem }) {
  const navigate = useNavigate();
  const ownedMinedGems = minedGems.filter(minedGem => minedGem.owner !== account);

  const handleMarkAsSelected = (gemId, price) => {
    markNewOwner(gemId, price);
  };

  const renderSelectedGems = () => {
    return ownedMinedGems.map((minedGem, key) => (
      minedGem.purchased === true && minedGem.selected === false && (
        <div key={key} className="card market-card" >
       <img src={minedGem.fileURL} className="card-img-top" alt={`${minedGem.gemType}`} />
          <div className="card-body">
            <h5 className="card-title">{minedGem.gemType}</h5>
            <p className="card-text">Price: {window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</p>
            <p className="card-text">Owner: {minedGem.owner}</p>
            <button className="btn" onClick={() => handleMarkAsSelected(minedGem.id, minedGem.price)}>
              Buy
            </button>
           {/* <button
              className="btn btn-secondary"
              name={minedGem.id}
              value={minedGem.price}
              onClick={(event) => sellGem(event.target.name)}
            >
              Sell
            </button>*/}
            <button  className="btn" onClick={() => navigate(`/gem-details/${minedGem.id}`)}>
                Details
              </button>
          </div>
        </div>
      )
    ));
  };

  return (
    <div className="gem-market">
      <p>&nbsp;</p>
      <h2>Mined Gem market</h2>
      <div className="gem-cards" >
        {renderSelectedGems()}
      </div>
      <div className='homeButton'>
        <button onClick={() => navigate(`/loggedIn`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default MinedGemMarket;
