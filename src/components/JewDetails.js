import React from 'react';
import { useParams } from 'react-router-dom';

function JewDetails({ selectedGems, minedGems, jewelry, account }) {
  const { id } = useParams();
  const gemId = id;

  const gemSelected = selectedGems.filter(gem => gem.owner && gem.id == gemId);
  const minedGem = minedGems.filter(gem => gem.owner && gem.id == gemId);
  const jewelryDetails = jewelry.filter(item => item.id == gemId);

  const renderSelectedGems = () => {
    return gemSelected.map((gem, key) => (
      <div key={key} className="card" style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#FFF7F3', 
        width: '90%', 
        margin: 'auto', 
        textAlign: 'center', 
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      }}>
        <h2>Selected Gem Details</h2>
        {gem.fileURL && (
          <div>
            <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={gem.fileURL} alt="Feltöltött kép" style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '20px' }} />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {gem.id.toString()}</p>
        <p><strong>Size:</strong> {gem.size.toString()} mm</p>
        <p><strong>Carat:</strong> {gem.carat.toString()} ct</p>
        <p><strong>Color:</strong> {gem.color}</p>
        <p><strong>Gem Type:</strong> {gem.gemType}</p>
        <p><strong>Polishing:</strong> {gem.polishing.toString()}</p>
        <p><strong>Used:</strong> {gem.used.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Gem cutter:</strong> {gem.owner}</p>
      </div>
    ));
  };

  const renderMinedGems = () => {
    return minedGem.map((gem, key) => (
      <div key={key} className="card" style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#FFF7F3', 
        width: '90%', 
        margin: 'auto', 
        textAlign: 'center', 
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      }}>
        <h2>Mined Gem Details</h2>
        {gem.fileURL && (
          <div>
            <a href={gem.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={gem.fileURL} alt="Feltöltött kép" style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '20px' }} />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {gem.id.toString()}</p>
        <p><strong>Type:</strong> {gem.gemType}</p>
        <p><strong>Weight:</strong> {gem.weight.toString()} mm</p>
        <p><strong>Size:</strong> {gem.size.toString()} mm</p>
        <p><strong>Mining Location:</strong> {gem.miningLocation}</p>
        <p><strong>Mining Year:</strong> {gem.miningYear.toString()}</p>
        <p><strong>Extraction Method:</strong> {gem.extractionMethod}</p>
        <p><strong>Selected:</strong> {gem.selected.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</p>
        <p><strong>Miner:</strong> {gem.owner}</p>
      </div>
    ));
  };

  const renderJewelry = () => {
    return jewelryDetails.map((jewelry, key) => (
      <div key={key} className="card" style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#FFF7F3', 
        width: '90%', 
        margin: 'auto', 
        textAlign: 'center', 
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      }}>
        <h2>Jewelry Details</h2>
        {jewelry.fileURL && (
          <div>
            <a href={jewelry.fileURL} target="_blank" rel="noopener noreferrer">
              <img src={jewelry.fileURL} alt="Jewelry" style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '20px' }} />
            </a>
          </div>
        )}
        <p><strong>ID:</strong> {jewelry.id.toString()}</p>
        <p><strong>Name:</strong> {jewelry.name}</p>
        <p><strong>Metal:</strong> {jewelry.metal}</p>
        <p><strong>Depth:</strong> {jewelry.depth.toString()} mm</p>
        <p><strong>Height:</strong> {jewelry.height.toString()} mm</p>
        <p><strong>Width:</strong> {jewelry.width.toString()} mm</p>
        <p><strong>Sale:</strong> {jewelry.sale.toString()}</p>
        <p><strong>Price:</strong> {window.web3.utils.fromWei(jewelry.price.toString(), 'Ether')} Eth</p>
        <p><strong>Jeweler:</strong> {jewelry.jeweler}</p>
        <p><strong>Owner:</strong> {jewelry.owner}</p>
      </div>
    ));
  };

  return (
    <div className="pt-5" style={{ maxWidth: '1200px', margin: 'auto' }}>
      <h1>Gem Details</h1>
      <div className="pt-5">
        {renderMinedGems()}
      </div>
      <div className="pt-5">
        {renderSelectedGems()}
      </div>
      <div className="pt-5">
        {renderJewelry()}
      </div>
    </div>
  );
}

export default JewDetails;
