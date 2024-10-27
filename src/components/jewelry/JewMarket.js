import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

function JewMarket({ jewelry, account, buyJewelry }) {
  const navigate = useNavigate();

  const navigateToJewDetails = (id) => {
    navigate(`/jewelry-details/${id}`);
  };

  const renderJewelryItems = () => {
    return jewelry.map((jewelryItem, key) => (
      jewelryItem.owner !== account && jewelryItem.processing === false && jewelryItem.sale === true && (
        <div key={key} className="card market-card">
          {jewelryItem.fileURL && (
            <img src={jewelryItem.fileURL} className="card-img-top" alt="Jewelry item" />
          )}
          <div className="card-body">
            <h5 className="card-title">{jewelryItem.name}</h5>
            <p className="card-text">Price: {ethers.utils.formatEther(jewelryItem.price.toString())} Eth</p>
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
    <div className="jew-market card-background">
      <p>&nbsp;</p>
      <h2>Jewelry Market</h2>
      <div className="jew-cards">
        {renderJewelryItems()}
      </div>
      <div className='homeButton'>
        <button onClick={() => navigate(`/loggedIn`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default JewMarket;
