import React from 'react';
import { useNavigate } from 'react-router-dom';




function OwnedByUser({ minedGems, selectedGems, account, purchaseGem, sellGem, markGemAsSelected, polishGem }) {
  const navigate = useNavigate();

  const handleMarkAsSelected = (gemId) => {
    markGemAsSelected(gemId)
    navigate(`/gem-select/${gemId}`);
      
    
  };

  // Filter gems based on the owner's account
  const ownedMinedGems = minedGems.filter(minedGem => minedGem.owner === account);
  const ownedSelectedGems = selectedGems.filter(selectedGem => selectedGem.owner === account);

  // Function to render rows for the 'List of mined gems'
  const renderMinedGems = () => {
    return ownedMinedGems.map((minedGem, key) => (
      minedGem.purchased === false && minedGem.selected === false &&(
        <tr key={key}>
          <th scope="row">{minedGem.id.toString()}</th>
          <td>{minedGem.gemType}</td>
          <td>{window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</td>
          <td>{minedGem.owner}</td>
          <td>
            <button
              name={minedGem.id}
              value={minedGem.price}
              onClick={(event) => purchaseGem(event.target.name, event.target.value)}
            >
              Process
            </button>
          </td>
        </tr>
      )
    ));
  };

  // Function to render rows for the 'List of selected gems'
 const renderSelectedGems = () => {
  console.log(ownedMinedGems[0])
    return ownedMinedGems.map((minedGem, key) => (
    minedGem.purchased === true &&  minedGem.selected === false && (
      <tr key={key}>
        <th scope="row">{minedGem.id.toString()}</th>
        <td>{minedGem.gemType}</td>
        <td>{window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</td>
        <td>{minedGem.owner}</td>
        <td>
          <button onClick={() => navigate(`/gem-select/${minedGem.id}`)}>
            Select Gem form
          </button>
        </td>
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

  // Function to render rows for the 'List of processing gems'
  const renderProcessingGems = () => {
    console.log(selectedGems[0]);
    return ownedSelectedGems.map((selectedGem, key) => (
      <tr key={key}>
        <th scope="row">{selectedGem.id.toString()}</th>
        <td>{selectedGem.gemType}</td>
        <td>{window.web3.utils.fromWei(selectedGem.price.toString(), 'Ether')} Eth</td>
        <td>{selectedGem.owner}</td>
        <td>{selectedGem.polishing.toString()}</td>
        <td>
          {selectedGem.polishing ? (
            <button onClick={() => navigate(`/gem-details/${selectedGem.id}`)}>
              Details
            </button>
          ) : (
            <button 
              id={selectedGem.id}
              value={selectedGem.price}
              onClick={() => polishGem(selectedGem.id)}>
              Polishing
            </button>
          )}
        </td>
      </tr>
    ));
  };
  

  return (
    <div id="tables" className="pt-5">
      <h2>List of mined gems</h2>
      <table className="table">
        <thead>{/* Table headers */}</thead>
        <tbody>{renderMinedGems()}</tbody>
      </table>

      <h2>List of selected gems</h2>
      <table className="table">
        <thead>{/* Table headers */}</thead>
        <tbody>{renderSelectedGems()}</tbody>
      </table>

      <h2>List of processing gems</h2>
      <table className="table">
        <thead>{/* Table headers */}</thead>
        <tbody>{renderProcessingGems()}</tbody>
      </table>
    </div>
  );
}

export default OwnedByUser;
