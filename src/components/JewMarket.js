import React from 'react';
import { useNavigate } from 'react-router-dom';

function JewMarket({ jewelry, account, buyJewelry }) {
  const navigate = useNavigate();

  const navigateToJewDetails = (jewId) => {
    navigate(`/jew-details/${jewId}`);
  };

  const renderJewelryItems = () => {
    return jewelry.map((jewelryItem, key) => (
      jewelryItem.owner !== account && jewelryItem.processing === false && jewelryItem.sale === true && (
        <div key={key} className="card" style={{ width: '30%', marginBottom: '20px', padding: '20px', backgroundColor: '#FFF7F3', margin: '10px', textAlign: 'center', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
          {jewelryItem.fileURL && (
            <img src={jewelryItem.fileURL} className="card-img-top" alt={`${jewelryItem.name}`} style={{ width: '100%', height: '150px', objectFit: 'contain', marginTop: '20px' }} />
          )}
          <div className="card-body">
            <h5 className="card-title">{jewelryItem.name}</h5>
            <p className="card-text">Price: {window.web3.utils.fromWei(jewelryItem.price.toString(), 'Ether')} Eth</p>
            <p className="card-text">Owner: {jewelryItem.owner}</p>
            <button className="btn btn-primary" onClick={() => navigateToJewDetails(jewelryItem.id)}>
              Details
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => buyJewelry(jewelryItem.id, jewelryItem.price)}
            >
              Buy
            </button>
          </div>
        </div>
      )
    ));
  };

  return (
    <div className="jew-market">
      <p>&nbsp;</p>
      <h2>Jew market :P</h2>
      <div className="jew-cards" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {renderJewelryItems()}
      </div>
      <div className='homeButton'>
        <button onClick={() => navigate(`/loggedIn`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default JewMarket;
