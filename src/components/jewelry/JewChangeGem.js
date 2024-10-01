import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function JewChangeGem({ selectedGems, markGemAsUsed,  jewelryContract, account, replaceGem,markGemAsReplaced }) {
  const { id, oldGemId } = useParams();
  const navigate = useNavigate();
  const [prevGemsArray, setPrevGemsArray] = useState([]);
  
  
  const handleRepair = (newGemId) => {
    
    console.log('Jewelry ID:', id, 'Old Gem ID:', oldGemId, 'New Gem ID:', newGemId);
    markGemAsUsed(newGemId);
    replaceGem(id, oldGemId, newGemId);
    markGemAsReplaced(oldGemId);
   // updateGem(oldGemId, newGemId);
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
    return ownedSelectedGems.map((gem, key) => (
      gem.used === false && (
      <tr key={key}>
        <td>{gem.id.toString()}</td>
        <td>size</td>
        <td>carat</td>
        <td>color and type</td>
        <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
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
            <th>Size</th>
            <th>Carat</th>
            <th>Color and type</th>
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
