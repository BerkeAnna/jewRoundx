import React from 'react';
import { useNavigate } from 'react-router-dom';



function GemMarket({ selectedGems, account, purchaseGem }) {
  const navigate = useNavigate();

  const handlePurchase = (gemId, price) => {
    purchaseGem(gemId, price);
  };

  return (
    <div >
      <p>&nbsp;</p>
      <h2>Gem market :D</h2>
      <div id="tables">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Type</th>
            <th scope="col">Price</th>
            <th scope="col">Owner</th>
            <th scope="col">Buy</th>
          </tr>
        </thead>
        <tbody>
          {selectedGems && selectedGems.map((selectedGem, key) => {
            return(
              selectedGem.used === false && selectedGem.owner !== account ? (
                <tr key={key}>
                  <th scope="row">{selectedGem.id.toString()}</th>
                  <td>{selectedGem.gemType}</td>
                  <td>{window.web3.utils.fromWei(selectedGem.price.toString(), 'Ether')} Eth</td>
                  <td>{selectedGem.owner}</td>
                  
                  <td>
                    <button
                      onClick={() => handlePurchase(selectedGem.id.toString(), selectedGem.price.toString())}
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              ) : null
            )
          })}
        </tbody>
      </table>
      </div>
      <div className='homeButton'>
        <button onClick={() => navigate(`/`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default GemMarket;
