import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Details.css';

function JewProcessing({ selectedGems, updateGem, markGemAsUsed }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleRepair = (gemId) => {
    markGemAsUsed(gemId);
    updateGem(parseInt(id), gemId);
    navigate(`/jewelry-details/${id}`);
  };

  const renderSelectedGems = () => {
    return selectedGems.map((gem, key) => {
      if (gem.used === false) {
        return (
          <tr key={key}>
            <td>{gem.id.toString()}</td>
            <td>{gem.size}</td>
            <td>{gem.carat.toString()} ct</td>
            <td>{gem.colorGemType}</td>
            <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
            <td>
              <button onClick={() => handleRepair(gem.id)} className="btn">
                Select
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
