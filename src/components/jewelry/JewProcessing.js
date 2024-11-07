import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Details.css';
import { ethers } from 'ethers';

function JewProcessing({ selectedGems, updateGem, markGemAsUsed, account }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleRepair = (gemId) => {
    markGemAsUsed(gemId);
    updateGem(parseInt(id), gemId);
    navigate(`/jewelry-details/${id}`);
  };

  const renderSelectedGems = () => {
    return selectedGems.map((gem, key) => {
      if (gem.used === false && gem.owner == account) {
        return (
          <tr key={key}>
            <td>{gem.id.toString()}</td>
            <td>{gem.details.gemType}</td>
            <td>{gem.details.size.toString()} mm</td>
            <td>{gem.details.carat.toString()} ct</td>
            <td>{gem.details.color.toString()}</td>
            <td>{gem.price.toString()} Eth</td> {/* Convert to ETH */}
            <td>
              <button onClick={() => handleRepair(gem.id)} className="btn">
                Add gem
              </button>
            </td>
          </tr>
        );
      }
      return null;
    });
  };

  return (
    <div id="tables" className="pt-5">
      <h1>Processing Jewelry</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Size</th>
            <th>Carat</th>
            <th>Color and type</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderSelectedGems()}</tbody>
      </table>
    </div>
  );
}

export default JewProcessing;