import React from 'react';
import { useNavigate } from 'react-router-dom';

function OwnedByUser({ minedGems, selectedGems, jewelry, account, purchaseGem, sellGem, markGemAsSelected, markGemAsUsed, polishGem }) {
  const navigate = useNavigate();

  const handleMarkAsSelected = (gemId) => {
    markGemAsSelected(gemId);
    navigate(`/gem-select/${gemId}`);
  };

  const handleMarkAsUsed = (gemId) => {
    markGemAsUsed(gemId);
    navigate(`/jewelry-making/gem/${gemId}`);
  };

  // Filter gems based on the owner's account
  const ownedMinedGems = minedGems.filter((minedGem) => minedGem.owner === account);
  const ownedSelectedGems = selectedGems.filter((selectedGem) => selectedGem.owner === account);
  const ownedJewelry = jewelry.filter((jewelry) => jewelry.owner === account);

  // Function to render rows for the 'List of mined gems'
  const renderMinedGems = () => {
    return ownedMinedGems.map((minedGem, key) => (
      minedGem.purchased === false && minedGem.selected === false && (
        <tr key={key}>
          <th scope="row">{minedGem.id.toString()}</th>
          <td>{minedGem.gemType}</td>
          <td>{window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</td>
          <td>{minedGem.owner}</td>
          <td>
            <button onClick={() => purchaseGem(minedGem.id.toString(), minedGem.price.toString())}>
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
      minedGem.purchased === true && minedGem.selected === false && (
        <tr key={key}>
          <th scope="row">{minedGem.id.toString()}</th>
          <td>{minedGem.gemType}</td>
          <td>{window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</td>
          <td>{minedGem.owner}</td>
          <td className="button-container">
            <button onClick={() => handleMarkAsSelected(minedGem.id)}>
              Select Gem
            </button>
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
      selectedGem.used === false && (
        <tr key={key}>
          <th scope="row">{selectedGem.id.toString()}</th>
          <td>{selectedGem.id.toString()}</td>
          <td>{selectedGem.gemType}</td>
          <td>{window.web3.utils.fromWei(selectedGem.price.toString(), 'Ether')} Eth</td>
          <td>{selectedGem.owner}</td>
          <td>{selectedGem.used.toString()}</td>
          <td className="button-container">
         
            {!selectedGem.forSale && !selectedGem.used ? (
              <>
                <button onClick={() => navigate(`/gem-details/${selectedGem.id}`)}>
                  Details
                </button>
                <button onClick={() => handleMarkAsUsed(selectedGem.id)}>
                  Make jewelry
                </button>
                <button
                id={selectedGem.id}
                value={selectedGem.price}
                onClick={() => polishGem(selectedGem.id)}
              >
                ForSale
              </button>
              </>
            ) : (
              <div>
                <button onClick={() => navigate(`/gem-details/${selectedGem.id}`)}>
                Details
                </button>
                <button
                  id={selectedGem.id}
                  value={selectedGem.price}
                  onClick={() => polishGem(selectedGem.id)}
                >
                  Remove from market
                </button>
              </div>
            )}
          </td>
        </tr>
      )
    ));
  };

  const renderJewelry = () => {
    return ownedJewelry.map((jewelry, key) => (
      <tr key={key}>
        <th scope="row">{jewelry.id.toString()}</th>
        <td>{jewelry.gemType}</td>
        <td>{window.web3.utils.fromWei(jewelry.price.toString(), 'Ether')} Eth</td>
        <td>{jewelry.owner}</td>
        <td className="button-container">
          <button onClick={() => navigate(`/jew-details/${jewelry.id}`)}>
            Details
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div id="tables" className="pt-5">
      <h2>List of mined gems</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Owner</th>
            <th scope="col">*</th>
          </tr>
        </thead>
        <tbody>{renderMinedGems()}</tbody>
      </table>

      <h2>List of selected gems</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Owner</th>
            <th scope="col">*</th>
          </tr>
        </thead>
        <tbody>{renderSelectedGems()}</tbody>
      </table>

      <h2>List of processing gems</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col">Type</th>
            <th scope="col">Price</th>
            <th scope="col">Owner</th>
            <th scope="col">Used - todo: delete</th>
            <th scope="col">*</th>
          </tr>
        </thead>
        <tbody>{renderProcessingGems()}</tbody>
      </table>

      <h2>List of jewelry</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">??</th>
            <th scope="col">Price</th>
            <th scope="col">Owner</th>
            <th scope="col">*</th>
          </tr>
        </thead>
        <tbody>{renderJewelry()}</tbody>
      </table>
    </div>
  );
}

export default OwnedByUser;
