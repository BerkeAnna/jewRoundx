import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Details.css';

function JewProcessing({ selectedGems, updateGem, markGemAsUsed, jewelryContract, account }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prevGemsArray, setPrevGemsArray] = useState([]);

  const handleRepair = (gemId) => {
    markGemAsUsed(gemId);
    updateGem(parseInt(id), gemId);
    navigate(`/jewelry-details/${id}`);
  };

  const ownedSelectedGems = selectedGems.filter((selectedGem) => selectedGem.owner === account);

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const details = await jewelryContract.methods.getJewelryDetails(id).call();
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId, 10));
        setPrevGemsArray(gemIdsAsInt);
      } catch (error) {
        console.error("Error fetching jewelry details: ", error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract]);

  const renderSelectedGems = () => {
    return ownedSelectedGems.map((gem, key) => {
      if (gem.used === false) {
        return (
          <tr key={key}>
            <td>{gem.id.toString()}</td>
            <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
            <td>
              <button onClick={() => handleRepair(gem.id)} className="btn">
                Select
              </button>
              <button className="btn" onClick={() => navigate(`/gem-details/${gem.id}`)}>
                Details
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