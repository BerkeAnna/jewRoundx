import React from 'react';
import { useNavigate } from 'react-router-dom';



function GemMarket({ minedGems, selectedGems, jewelry, account, purchaseGem, sellGem, markGemAsSelected, markGemAsUsed, polishGem }) {

  const navigate = useNavigate();
  const ownedMinedGems = minedGems.filter(minedGem => minedGem.owner !== account)

  const handlePurchase = (gemId, price) => {
    purchaseGem(gemId, price);
  };

  
  const handleMarkAsSelected = (gemId) => {
    markGemAsSelected(gemId)
    navigate(`/gem-select/${gemId}`);
      
    
  };
  const handleMarkAsUsed = (gemId) => {
    markGemAsUsed(gemId)
    navigate(`/jewelry-making/gem/${gemId}`);
      
    
  };

  const renderSelectedGems = () => {
    //console.log(ownedMinedGems[0])
      return ownedMinedGems.map((minedGem, key) => (
      minedGem.purchased === true &&  minedGem.selected === false &&  (
        <tr key={key}>
          <th scope="row">{minedGem.id.toString()}</th>
          <td>{minedGem.gemType}</td>
          <td>{window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</td>
          <td>{minedGem.owner}</td>
        {/*} 
          <td>
            <button onClick={() => navigate(`/gem-select/${minedGem.id}`)}>
              Select Gem form
            </button>
          </td>
        */}
          <td>
          <button onClick={() => handleMarkAsSelected(minedGem.id)}>
                Select Gem
              </button>
  
          </td>
          <td>
            <button
              name={minedGem.id}
              value={minedGem.price}
              onClick={(event) => sellGem(event.target.name)}
            >
              Sell
            </button>
          </td>
        </tr>
      )
    ));
  };

  return (
    <div >
      <p>&nbsp;</p>
      <h2>Gem market :D</h2>
      <div id="tables">
      <h2>List of selected gems</h2>
      <table className="table">
      <thead>
          { 
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Owner</th>
            <th scope="col">*</th>
            <th scope="col">*</th>
          </tr>
          }
        </thead>
        <tbody>{renderSelectedGems()}</tbody>
      </table>
      </div>
      <div className='homeButton'>
        <button onClick={() => navigate(`/`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default GemMarket;
