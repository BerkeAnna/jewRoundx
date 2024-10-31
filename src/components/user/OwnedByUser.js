import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

function OwnedByUser({ minedGems, selectedGems, jewelry, account, purchaseGem, polishGem, markedAsFinished, markedAsSale, addForRepair, returnToOwner }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [jewelryId, setJewelryId] = useState('');
  
  // Load user data from localStorage
  const username = localStorage.getItem('username') || '';
  const role = localStorage.getItem('role') || '';

  console.log(role)

  const handleMarkAsSelected = (gemId) => {
    navigate(`/gem-select/${gemId}`);
  };

  const handleJewMaking = (gemId) => {
    navigate(`/jewelry-making/gem/${gemId}`);
  };

  const handleMarkedAsFinished = (gemId) => {
    markedAsFinished(gemId);
    navigate(`/ownMinedGems`);
  };

  const handleMarkedAsSale = (gemId) => {
    markedAsSale(gemId);
    navigate(`/ownMinedGems`);
  };

  const handleAddRepair = (gemId) => {
    addForRepair(gemId);
    navigate(`/ownMinedGems`);
  };

  const handleReturnToOwner = (gemId) => {
    returnToOwner(gemId);
    navigate(`/ownMinedGems`);
  };

  const ownedMinedGems = minedGems.filter((minedGem) => minedGem.owner === account);
  const ownedSelectedGems = selectedGems.filter((selectedGem) => selectedGem.owner === account);
  const ownedJewelry = jewelry.filter((jewelry) => jewelry.owner === account);

  const renderMinedGems = () => {
    return ownedMinedGems.map((minedGem, key) => (
      minedGem.purchased === false && minedGem.selected === false && (
        <tr key={key}>
          <th scope="row">{minedGem.id.toString()}</th>
          <td>{minedGem.gemType}</td>
          <td>{minedGem.price} Eth</td> {/* Convert to ETH */}
          <td>{minedGem.owner}</td>
          <td>
            <button onClick={() => purchaseGem(minedGem.id.toString(), minedGem.price)} className="btn">
              Process
            </button>
          </td>
        </tr>
      )
    ));
  };
  
  const renderSelectedGems = () => {
    return ownedMinedGems.map((minedGem, key) => (
      minedGem.purchased === true && minedGem.selected === false && (
        <tr key={key}>
          <th scope="row">{minedGem.id.toString()}</th>
          <td>{minedGem.gemType}</td>
          <td>{minedGem.price} Eth</td> {/* Convert to ETH */}
          <td>{minedGem.owner}</td>
          <td className="button-container">
            <button onClick={() => handleMarkAsSelected(minedGem.id)} className="btn">
              Select Gem
            </button>
          </td>
        </tr>
      )
    ));
  };
  
  const renderProcessingGems = () => {
    return ownedSelectedGems.map((selectedGem, key) => (
      selectedGem.used === false && (
        <tr key={key}>
          <th scope="row">{selectedGem.id.toString()}</th>
          <td>{selectedGem.colorGemType}</td>
          <td>{selectedGem.price.toString()} Eth</td> {/* Convert to ETH */}
          <td>{selectedGem.owner}</td>
          <td className="button-container">
            {/* Render buttons based on conditions */}
            {!selectedGem.forSale && !selectedGem.used ? (
              <>
                <button onClick={() => navigate(`/gem-details/${selectedGem.id}`)} className="btn">
                  Details
                </button>
                {role === 'Jeweler' && (
                  <button onClick={() => handleJewMaking(selectedGem.id)} className="btn">
                    Make jewelry
                  </button>
                )}
                <button onClick={() => polishGem(selectedGem.id)} className="btn">
                  ForSale
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate(`/gem-details/${selectedGem.id}`)} className="btn">
                  Details
                </button>
                <button onClick={() => polishGem(selectedGem.id)} className="btn">
                  Remove from market
                </button>
              </>
            )}
          </td>
        </tr>
      )
    ));
  };
  
  const renderJewelry = () => {
    return ownedJewelry.map((jewelry, key) => (
      !jewelry.processing && (
        <tr key={key}>
          <th scope="row">{jewelry.id.toString()}</th>
          <td>{jewelry.name}</td>
          <td>{jewelry.price.toString()} Eth</td> {/* Convert to ETH */}
          <td>{jewelry.owner}</td>
          <td className="button-container">
            <button onClick={() => navigate(`/jewelry-details/${jewelry.id}`)} className="btn">
              Details
            </button>
            {role === 'Jewelry Owner' ? (
              <button onClick={() => handleAddRepair(jewelry.id)} className="btn">
                Add to repair
              </button>
            ) : (
              !jewelry.sale && (
                <>
                  <button onClick={() => navigate(`/repair/${jewelry.id}`)} className="btn">
                    Repair
                  </button>
                  {jewelry.jewOwner !== jewelry.owner && (
                    <button onClick={() => handleReturnToOwner(jewelry.id)} className="btn">
                      Return To Owner
                    </button>
                  )}
                </>
              )
            )}
            {jewelry.sale ? (
              <button onClick={() => handleMarkedAsSale(jewelry.id)} className="btn">
                Remove from market
              </button>
            ) : (
              jewelry.jewOwner === jewelry.owner && (
                <button onClick={() => handleMarkedAsSale(jewelry.id)} className="btn">
                  Sale
                </button>
              )
            )}
          </td>
        </tr>
      )
    ));
  };
  
  const renderProcessingJewelry = () => {
    return ownedJewelry.map((jewelry, key) => (
      jewelry.processing && (
        <tr key={key}>
          <th scope="row">{jewelry.id.toString()}</th>
          <td>{jewelry.name}</td>
          <td>{jewelry.price.toString()} Eth</td> {/* Convert to ETH */}
          <td>{jewelry.owner}</td>
          <td className="button-container">
            <button onClick={() => navigate(`/jewelry-details/${jewelry.id}`)} className="btn">
              Details
            </button>
            <button onClick={() => navigate(`/jewelry-processing/${jewelry.id}`)} className="btn">
              Add gem
            </button>
            <button onClick={() => handleMarkedAsFinished(jewelry.id)} className="btn">
              Finish
            </button>
          </td>
        </tr>
      )
    ));
  };
  

  return (
    <div id="tables" className="pt-5">
      
      {role === 'Miner' && (
      <div>
        <h2>List of mined gems</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Type</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">*</th>
            </tr>
          </thead>
          <tbody>{renderMinedGems()}</tbody>
        </table>
      </div>
      )}

      {role === 'Gem Cutter' && (
      <div>
        <h2>List of selected gems</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Type</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">*</th>
            </tr>
          </thead>
          <tbody>{renderSelectedGems()}</tbody>
        </table>
      </div>
      )}

      {(role === 'Gem Cutter' || role === 'Jeweler') && (
      <div>
        <h2>List of processing gems</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Details</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">*</th>
            </tr>
          </thead>
          <tbody>{renderProcessingGems()}</tbody>
        </table>
      </div>
      )}

      { role === 'Jeweler' &&(
      <div>
        <h2>List of processing jewelry</h2>
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
          <tbody>{renderProcessingJewelry()}</tbody>
        </table>
      </div>
      )}

      {(role === 'Jeweler' || role === 'Jewelry Owner') &&(
      <div>
        <h2>List of jewelry</h2>
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
          <tbody>{renderJewelry()}</tbody>
        </table>
      </div>
      )}
    </div>
  );
}

export default OwnedByUser;