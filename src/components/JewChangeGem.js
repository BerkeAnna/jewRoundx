import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function JewChangeGem({ selectedGems, updateGem, markGemAsUsed, minedGems, jewelry, jewelryContract  }) {
  const { id } = useParams();
  const gemId = id;
  const navigate = useNavigate();
  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const gemSelected = selectedGems.filter(gem => gem.owner && gem.id == gemId);
  const minedGem = minedGems.filter(gem => gem.owner && gem.id == gemId);
  const jewelryDetails = jewelry.filter(item => item.id == gemId);

  const handleRepair = (gemId) => {
    markGemAsUsed(gemId);
    updateGem(parseInt(id), gemId);
    navigate(`/jew-details/${id}`);
  };

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const details = await jewelryContract.methods.getJewelryDetails(id).call();
        const gemIdsAsInt = details.previousGemIds.map(gemId => parseInt(gemId, 10));
        setPrevGemsArray(gemIdsAsInt);

        console.log("Prev gems id (int): ", gemIdsAsInt);
      } catch (error) {
        console.error("Error fetching jewelry details: ", error);
      }
    };

    fetchJewelryDetails();
  }, [id, jewelryContract]);

  const cardStyle = {
    marginBottom: '20px',
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#FFF7F3',
    width: '80%',
    margin: 'auto',
    textAlign: 'center',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
  };

  const renderSelectedGems = () => {
    return selectedGems.map((gem, key) => (
      gem.used === false && (
      <tr key={key}>
        <td>{gem.id.toString()}</td>
        <td>{gem.size.toString()}</td>
        <td>{gem.carat.toString()}</td>
        <td>{gem.colorGemType}</td>
        <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
        <td>
          <button onClick={() => handleRepair(gem.id)} className="btn btn-primary">
            Select
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
