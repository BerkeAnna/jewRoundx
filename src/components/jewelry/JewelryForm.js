import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Forms.css';

function JewelryForm({ jewelryMaking, markGemAsUsed }) {  // Közvetlenül elérhető függvények
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  const { id } = useParams();

  const handleMarkAsUsed = (gemId) => {
    markGemAsUsed(gemId);  // Nincs többé szükség a props-ra
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    handleMarkAsUsed(id);  // Meghívjuk a markGemAsUsed-et
    const formData = new FormData(event.target);
    const file = fileInputRef.current.files[0];
    
    let fileUrl = "";
    if (file) {
      try {
        const fileData = new FormData();
        fileData.append("file", file);

        const response = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          fileData,
          {
            headers: {
              'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
              'pinata_secret_api_key': process.env.REACT_APP_PINATA_PRIVATE_KEY,
            },
          }
        );
        fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      } catch (err) {
        console.error("Error uploading file: ", err);
        return;
      }
    }

    const gemId = parseInt(id, 10);  
    const name = formData.get('name').toString();
    const metal = formData.get('metal').toString();
    const depth = formData.get('depth').toString();
    const height = formData.get('height').toString();
    const width = formData.get('width').toString();
    const size = `Depth: ${depth} mm - Height: ${height} mm - Width: ${width} mm`; 
    const physicalDetails = `Metal: ${metal} - ${size}`; 
    const price = window.web3.utils.toWei(formData.get('price').toString(), 'Ether');
    const sale = false;

    if (!name) {
      console.error("Name is required.");
      return; 
    }

    jewelryMaking(name, gemId, physicalDetails, sale, price, fileUrl);

  };

  return (
    <div className="card-container card-background">
      <div className=" form-card ">
        <h1>Add jewelry</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input id="name" name="name" type="text" className="form-control" placeholder="name" required />
          </div>
          <div className="form-group">
            <input id="depth" name="depth" type="text" className="form-control" placeholder="depth" required />
          </div>
          <div className="form-group">
            <input id="height" name="height" type="text" className="form-control" placeholder="height" required />
          </div>
          <div className="form-group">
            <input id="width" name="width" type="text" className="form-control" placeholder="width" required />
          </div>
          <div className="form-group">
            <input id="metal" name="metal" type="text" className="form-control" placeholder="metal" required />
          </div>
          <div className="form-group">
            <input id="price" name="price" type="text" className="form-control" placeholder="price" required />
          </div>
          <div className="form-group">
            <input type="file" ref={fileInputRef} className="form-control" />
          </div>
          <button type="submit" className="button">Make jewelry</button>
        </form>
      </div>
    </div>
  );
}

export default JewelryForm;