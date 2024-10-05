import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Forms.css';

function JewelryForm({ jewelryMaking, markGemAsUsed }) {  // Közvetlenül elérhető függvények
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  const { id } = useParams();
  const [type, setType] = useState("Ring");

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
    const type = formData.get('type').toString();
    const metal = formData.get('metal').toString();
    const depth = formData.get('depth').toString();
    const height = formData.get('height').toString();
    const width = formData.get('width').toString();
    const size = `Depth: ${depth} mm - Height: ${height} mm - Width: ${width} mm`; 
    const additionalData = formData.get('additionalData').toString();
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const sale = false;

    if (!name) {
      console.error("Name is required.");
      return; 
    }

    const metadata = {
      name,
      type,
      gemId,
      metal,
      size,
      additionalData,
      fileUrl 
    };

    let metadataUrl = "";
    try {
      const metadataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
        headers: {
          'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.REACT_APP_PINATA_PRIVATE_KEY,
        },
      });

      if (metadataResponse && metadataResponse.data && metadataResponse.data.IpfsHash) {
        metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;
        console.log("Metadata uploaded successfully: ", metadataUrl);
      } else {
        console.error('Pinata metadata upload error: ', metadataResponse);
        return;
      }
    } catch (err) {
      console.error("Error uploading metadata: ", err);
      return;
    }

    try {
      console.log("Submitting jewelry creation...");
      await jewelryMaking(name, gemId, metadataUrl, sale, price, fileUrl);  // Helyes függvényhívás
      console.log("Jewelry created successfully.");
      navigate('/loggedIn');
    } catch (error) {
      console.error("Error in jewelry creation: ", error);
    }
  };

  return (
    <div className="card-container card-background">
      <div className="form-card">
        <h1>Add Jewelry</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input id="name" name="name" type="text" className="form-control" placeholder="Name" required />
          </div>
          <div className="form-group">
            <select name="type" value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="Ring">Ring</option>
              <option value="Bracelet">Bracelet</option>
              <option value="Earrings">Earrings</option>
              <option value="Necklace">Necklace</option>
            </select>
          </div>
          <div className="form-group">
            <input id="price" name="price" type="text" className="form-control" placeholder="Price in Ether" required />
          </div>
          <div className="form-group">
            <input id="depth" name="depth" type="text" className="form-control" placeholder="Depth in mm" required />
          </div>
          <div className="form-group">
            <input id="height" name="height" type="text" className="form-control" placeholder="Height in mm" required />
          </div>
          <div className="form-group">
            <input id="width" name="width" type="text" className="form-control" placeholder="Width in mm" required />
          </div>
          <div className="form-group">
            <input id="metal" name="metal" type="text" className="form-control" placeholder="Metal" required />
          </div>
          <div className="form-group">
            <input id="additionalData" name="additionalData" type="textarea" className="form-control" placeholder="Additional data" required />
          </div>
          <div className="form-group">
            <input type="file" ref={fileInputRef} className="form-control" />
          </div>
          <button type="submit" className="button">Make Jewelry</button>
        </form>
      </div>
    </div>
  );
}

export default JewelryForm;
