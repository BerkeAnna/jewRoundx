import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Repair({ selectedGems, updateGem }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleRepair = (gemId) => {
    updateGem(parseInt(id), gemId);
    navigate(`/jew-details/${id}`);
  };

  const renderSelectedGems = () => {
    return selectedGems.map((gem, key) => (
      <tr key={key}>
        <td>{gem.id.toString()}</td>
        <td>{gem.size.toString()}</td>
        <td>{gem.carat.toString()}</td>
        <td>{gem.color}</td>
        <td>{gem.gemType}</td>
        <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
        <td>
          <button onClick={() => handleRepair(gem.id)} className="btn btn-primary">
            Select
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="pt-5" style={{ maxWidth: '1200px', margin: 'auto' }}>
      <h1>Repair Jewelry</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Size</th>
            <th>Carat</th>
            <th>Color</th>
            <th>Gem Type</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderSelectedGems()}</tbody>
      </table>
    </div>
  );
}

export default Repair;
