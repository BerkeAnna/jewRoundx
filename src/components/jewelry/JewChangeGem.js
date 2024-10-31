import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function JewChangeGem({ selectedGems, markGemAsUsed,  jewelryContract, account, replaceGem,markGemAsReplaced, updateGem }) {
  const { id, oldGemId } = useParams();
  const navigate = useNavigate();
  const [prevGemsArray, setPrevGemsArray] = useState([]);
  
  
  const handleRepair = (newGemId) => {
    
    console.log('Jewelry ID:', id, 'Old Gem ID:', oldGemId, 'New Gem ID:', newGemId);
    markGemAsUsed(newGemId);
    console.log( 'markGemAsUsed New Gem ID:', newGemId);
    replaceGem(id, oldGemId, newGemId);
    console.log('replaceGem Jewelry ID:', id, 'Old Gem ID:', oldGemId, 'New Gem ID:', newGemId);
    markGemAsReplaced(oldGemId);
    console.log('markGemAsReplaced', 'Old Gem ID:', oldGemId);
    updateGem(id, newGemId);
    console.log('updategem', 'Old Gem ID:', newGemId);
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
        <td>{gem.details.size}</td>
        <td>{gem.details.carat.toString()}</td>
        <td>{gem.details.color.toString()}</td>
        <td>{gem.details.gemType.toString()}</td>
        <td>{gem.price.toString()} Eth</td>
        <td>
          <button onClick={() => handleRepair(gem.id)} className="btn btn-primary">
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
            <th>Color</th>
            <th>Type</th>
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