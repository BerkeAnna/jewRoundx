import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Details.css';

function Repair({ selectedGems, updateGem, markGemAsUsed, minedGems, jewelry, jewelryContract, account, selectingContract,replaceGem  }) {
  const { id } = useParams();
  const gemId = id;
  const navigate = useNavigate();
  const [prevGemsArray, setPrevGemsArray] = useState([]);
  const gemSelected = selectedGems.filter(gem => gem.owner && gem.id == gemId);
  const minedGem = minedGems.filter(gem => gem.owner && gem.id == gemId);
  const jewelryDetails = jewelry.filter(item => item.id == gemId);

  const handleRepair = (newGemId) => {
    const oldGemId = parseInt(id);
    markGemAsUsed(newGemId);
    replaceGem(oldGemId, newGemId);
    navigate(`/jewelry-details/${id}`);
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


  const renderSelectedGems = () => {
    return selectedGems.map((gem, key) => (
      gem.used === false && (
      <tr key={key}>
        <td>{gem.id.toString()}</td>
        <td>{gem.size.toString()}</td>
        <td>{gem.carat.toString()} ct</td>
        <td>{gem.colorGemType}</td>
        <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
        <td>
          <button onClick={() => handleRepair(gem.id)} className="btn">
            Select
          </button>
        </td>
      </tr>
      )
    ));
  };
  const renderSelectedOwnedGem = () => {
    const filteredSelectedGems = selectedGems.filter(gem => prevGemsArray.includes(parseInt(gem.id, 10)));

    return filteredSelectedGems.map((gem, key) => (
      <div key={key} className="card">
        <h2>Selected Gem Details</h2>
        {gem.fileURL && (
          <div>
            <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={gem.fileURL} alt="Picture" className='details-image' />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {gem.id.toString()}</p>
        <p><strong>Size:</strong>  {gem.size.toString()} mm</p>
        <p><strong>Carat:</strong> {gem.carat.toString()} ct</p>
        <p><strong>Color and gem type:</strong> {gem.colorGemType.toString()}</p>
        <p><strong>forSale:</strong> {gem.forSale.toString()}</p>
        <p><strong>Used:</strong> {gem.used.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Gem cutter:</strong> {gem.gemCutter}</p>
        <p><strong>Owner:</strong> {gem.owner}</p>
        <button onClick={() => navigate(`/repair/${id}/change-gem/${gem.id}`)}>Change</button>
      </div>
    ));
};


  return (
    <div className="details-details-container pt-5">
      <h1>Processing Jewelry</h1>
      <h3>Choose the next gem</h3>
      
      <div>{renderSelectedOwnedGem()}</div>
    </div>
  );
}

export default Repair;