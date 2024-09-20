import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function JewChangeGem({ selectedGems, updateGem, markGemAsUsed, minedGems, jewelry, jewelryContract, account, selectingContract, replaceGem }) {
  const { id, oldGemId } = useParams();
  const navigate = useNavigate();
  const [prevGemsArray, setPrevGemsArray] = useState([]);
  
  
  const handleRepair = (newGemId) => {
    //const oldGemId = parseInt(id); // Assuming this is the jewelryId from useParams
    
    console.log('Jewelry ID:', id, 'Old Gem ID:', oldGemId, 'New Gem ID:', newGemId);
    markGemAsUsed(newGemId);
    replaceGem(id, oldGemId, newGemId);
    updateGem(oldGemId, newGemId);
    navigate(`/jew-details/${id}`);

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
        <td>{gem.size.toString()}</td>
        <td>{gem.carat.toString()}</td>
        <td>{gem.colorGemType}</td>
        <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
        <td>
          <button onClick={() => handleRepair(parseInt(gem.id.toString()))} className="btn btn-primary">
            Select-
          </button>
        </td>
      </tr>
      )
    ));
  };

  return (
    <div className="pt-5" style={{ maxWidth: '1200px', margin: 'auto' }}>
      <h1>Change Gem</h1>
      <h3>Choose the next gem</h3>
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
