import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers'; // ethers.js importálása

function JewChangeGem({ selectedGems, markGemAsUsed, jewelryContract, account, replaceGem, markGemAsReplaced }) {
  const { id, oldGemId } = useParams();
  const navigate = useNavigate();
  const [prevGemsArray, setPrevGemsArray] = useState([]);

  const handleRepair = async (newGemId) => {
    console.log('Jewelry ID:', id, 'Old Gem ID:', oldGemId, 'New Gem ID:', newGemId);
    await markGemAsUsed(newGemId);
    await replaceGem(id, oldGemId, newGemId);
    await markGemAsReplaced(oldGemId);
    navigate(`/jewelry-details/${id}`);
  };

  const ownedSelectedGems = selectedGems.filter((selectedGem) => selectedGem.owner === account);

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const details = await jewelryContract.getJewelryDetails(id);
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId, 10));
        setPrevGemsArray(gemIdsAsInt);
      } catch (error) {
        console.error("Error fetching jewelry details: ", error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract]);

  const renderSelectedGems = () => {
    return ownedSelectedGems.map((gem, key) => (
      gem.used === false && (
        <tr key={key}>
          <td>{gem.id.toString()}</td>
          <td>{ethers.utils.formatEther(gem.price.toString())} Eth</td> {/* ethers.js konverzió */}
          <td>
            <button onClick={() => handleRepair(parseInt(gem.id.toString()))} className="btn btn-primary">
              Select
            </button>
            <button className="btn" onClick={() => navigate(`/gem-details/${gem.id}`)}>
              Details
            </button>
          </td>
        </tr>
      )
    ));
  };

  return (
    <div id="tables" className="pt-5">
      <h2>Change Gem</h2>
      <h2>Choose the next gem</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {renderSelectedGems()}
        </tbody>
      </table>
    </div>
  );
}

export default JewChangeGem;
