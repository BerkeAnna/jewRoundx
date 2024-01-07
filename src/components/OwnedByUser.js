import React from 'react';
import { useNavigate } from 'react-router-dom';

function OwnedByUser({ minedGems, selectedGems, account, purchaseGem, sellGem }) {
  const navigate = useNavigate();

  // Filter gems based on the owner's account
  const ownedMinedGems = minedGems.filter(minedGem => minedGem.owner === account);
  const ownedSelectedGems = selectedGems.filter(selectedGem => selectedGem.owner === account);

  // Function to render rows for the 'List of mined gems'
  const renderMinedGems = () => {
    return ownedMinedGems.map((minedGem, key) => (
      minedGem.purchased === false && (
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
    return ownedMinedGems.map((minedGem, key) => (
      minedGem.purchased === true && (
        <tr key={key}>
          <th scope="row">{minedGem.id.toString()}</th>
          <td>{minedGem.gemType}</td>
          <td>{window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</td>
          <td>{minedGem.owner}</td>
          <td>
            <button onClick={() => navigate(`/gem-select/${minedGem.id}`)}>
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
    return ownedSelectedGems.map((selectedGem, key) => (
      <tr key={key}>
        <th scope="row">{selectedGem.id.toString()}</th>
        <td>{selectedGem.gemType}</td>
        <td>{window.web3.utils.fromWei(selectedGem.price.toString(), 'Ether')} Eth</td>
        <td>{selectedGem.owner}</td>
        <td>
          <button onClick={() => navigate(`/gem-select/${selectedGem.id}`)}>
            Polishing
          </button>
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
