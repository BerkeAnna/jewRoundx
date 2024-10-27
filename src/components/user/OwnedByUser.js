import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

function OwnedByUser({
  minedGems,
  selectedGems,
  jewelry,
  account,
  purchaseGem,
  polishGem,
  markedAsFinished,
  markedAsSale,
  addForRepair,
  returnToOwner,
}) {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || '';

  const handleMarkAsSelected = (gemId) => {
    navigate(`/gem-select/${gemId}`);
  };

  const handleJewMaking = (gemId) => {
    navigate(`/jewelry-making/gem/${gemId}`);
  };

  const handleMarkedAsFinished = (jewelryId) => {
    markedAsFinished(jewelryId);
    navigate(`/ownMinedGems`);
  };

  const handleMarkedAsSale = (jewelryId) => {
    markedAsSale(jewelryId);
    navigate(`/ownMinedGems`);
  };

  const handleAddRepair = (jewelryId) => {
    addForRepair(jewelryId);
    navigate(`/ownMinedGems`);
  };

  const handleReturnToOwner = (jewelryId) => {
    returnToOwner(jewelryId);
    navigate(`/ownMinedGems`);
  };

  const ownedMinedGems = minedGems.filter((gem) => gem.owner === account);
  const ownedSelectedGems = selectedGems.filter((gem) => gem.owner === account);
  const ownedJewelry = jewelry.filter((jewelry) => jewelry.owner === account);

  const renderMinedGems = () => (
    ownedMinedGems.map((gem, key) => (
      !gem.purchased && !gem.selected && (
        <tr key={key}>
          <td>{gem.id}</td>
          <td>{gem.gemType}</td>
          <td>{ethers.utils.formatEther(gem.price.toString())} Eth</td>
          <td>{gem.owner}</td>
          <td>
            <button onClick={() => purchaseGem(gem.id, gem.price)} className="btn">Process</button>
          </td>
        </tr>
      )
    ))
  );

  const renderSelectedGems = () => (
    ownedMinedGems.map((gem, key) => (
      gem.purchased && !gem.selected && (
        <tr key={key}>
          <td>{gem.id}</td>
          <td>{gem.gemType}</td>
          <td>{ethers.utils.formatEther(gem.price.toString())} Eth</td>
          <td>{gem.owner}</td>
          <td>
            <button onClick={() => handleMarkAsSelected(gem.id)} className="btn">Select Gem</button>
          </td>
        </tr>
      )
    ))
  );

  const renderProcessingGems = () => (
    ownedSelectedGems.map((gem, key) => (
      !gem.used && (
        <tr key={key}>
          <td>{gem.id}</td>
          <td>{gem.colorGemType}</td>
          <td>{ethers.utils.formatEther(gem.price.toString())} Eth</td>
          <td>{gem.owner}</td>
          <td>
            <button onClick={() => navigate(`/gem-details/${gem.id}`)} className="btn">Details</button>
            {role === 'Jeweler' && (
              <button onClick={() => handleJewMaking(gem.id)} className="btn">Make Jewelry</button>
            )}
            <button onClick={() => polishGem(gem.id)} className="btn">ForSale</button>
          </td>
        </tr>
      )
    ))
  );

  const renderJewelry = () => (
    ownedJewelry.map((jewelry, key) => (
      !jewelry.processing && (
        <tr key={key}>
          <td>{jewelry.id}</td>
          <td>{jewelry.name}</td>
          <td>{ethers.utils.formatEther(jewelry.price.toString())} Eth</td>
          <td>{jewelry.owner}</td>
          <td>
            <button onClick={() => navigate(`/jewelry-details/${jewelry.id}`)} className="btn">Details</button>
            {role === 'Jewelry Owner' ? (
              <button onClick={() => handleAddRepair(jewelry.id)} className="btn">Add to Repair</button>
            ) : (
              !jewelry.sale && (
                <>
                  <button onClick={() => navigate(`/repair/${jewelry.id}`)} className="btn">Repair</button>
                  {jewelry.jewOwner !== jewelry.jeweler && (
                    <button onClick={() => handleReturnToOwner(jewelry.id)} className="btn">Return To Owner</button>
                  )}
                </>
              )
            )}
            <button onClick={() => handleMarkedAsSale(jewelry.id)} className="btn">
              {jewelry.sale ? 'Remove from Market' : 'Sale'}
            </button>
          </td>
        </tr>
      )
    ))
  );

  const renderProcessingJewelry = () => (
    ownedJewelry.map((jewelry, key) => (
      jewelry.processing && (
        <tr key={key}>
          <td>{jewelry.id}</td>
          <td>{jewelry.name}</td>
          <td>{ethers.utils.formatEther(jewelry.price.toString())} Eth</td>
          <td>{jewelry.owner}</td>
          <td>
            <button onClick={() => navigate(`/jewelry-details/${jewelry.id}`)} className="btn">Details</button>
            <button onClick={() => navigate(`/jewelry-processing/${jewelry.id}`)} className="btn">Add Gem</button>
            <button onClick={() => handleMarkedAsFinished(jewelry.id)} className="btn">Finish</button>
          </td>
        </tr>
      )
    ))
  );

  return (
    <div id="tables" className="pt-5">
      {role === 'Miner' && (
        <div>
          <h2>List of Mined Gems</h2>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Price</th>
                <th>Owner</th>
                <th>*</th>
              </tr>
            </thead>
            <tbody>{renderMinedGems()}</tbody>
          </table>
        </div>
      )}

      {role === 'Gem Cutter' && (
        <div>
          <h2>List of Selected Gems</h2>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Price</th>
                <th>Owner</th>
                <th>*</th>
              </tr>
            </thead>
            <tbody>{renderSelectedGems()}</tbody>
          </table>
        </div>
      )}

      {(role === 'Gem Cutter' || role === 'Jeweler') && (
        <div>
          <h2>List of Processing Gems</h2>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Details</th>
                <th>Price</th>
                <th>Owner</th>
                <th>*</th>
              </tr>
            </thead>
            <tbody>{renderProcessingGems()}</tbody>
          </table>
        </div>
      )}

      {role === 'Jeweler' && (
        <div>
          <h2>List of Processing Jewelry</h2>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Owner</th>
                <th>*</th>
              </tr>
            </thead>
            <tbody>{renderProcessingJewelry()}</tbody>
          </table>
        </div>
      )}

      {(role === 'Jeweler' || role === 'Jewelry Owner') && (
        <div>
          <h2>List of Jewelry</h2>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Owner</th>
                <th>*</th>
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
