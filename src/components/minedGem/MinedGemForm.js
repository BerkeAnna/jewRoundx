import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Forms.css';

function MinedGemForm(props) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const file = fileInputRef.current.files[0];

    let fileUrl = "";
    if (file) {
      try {
        // *** IPFS fájlfeltöltés időmérése ***
        const startFileUploadTime = performance.now();  // Kezdés
        const fileData = new FormData();
        fileData.append("file", file);

        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', fileData, {
          headers: {
            'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
            'pinata_secret_api_key': process.env.REACT_APP_PINATA_PRIVATE_KEY,
          },
        });

        fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        const endFileUploadTime = performance.now();  // Befejezés
        const fileUploadDuration = endFileUploadTime - startFileUploadTime;
        console.log(`IPFS fájlfeltöltés időtartama: ${fileUploadDuration} ms`);
        
      } catch (err) {
        console.error("Error uploading file: ", err);
        return;
      }
    }

    const gemType = formData.get('gemType').toString();
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const weight = formData.get('weight').toString();
    const depth = formData.get('depth').toString();
    const height = formData.get('height').toString();
    const width = formData.get('width').toString();
    const size = `${depth}x${height}x${width}`; 
    const details = `Carat: ${weight} ct, Size: ${size} mm, Image: ${fileUrl}`; // Részletek off-chain

    const metadata = {
      gemType,
      weight,
      size,
      miningLocation: formData.get('miningLocation').toString(),
      miningYear: formData.get('miningYear').toString(),
      fileUrl,
    };

    // *** IPFS metadata feltöltés időmérése ***
    let metadataUrl = "";
    try {
      const startMetadataUploadTime = performance.now();  // Kezdés
      const metadataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
        headers: {
          'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.REACT_APP_PINATA_PRIVATE_KEY,
        },
      });
      metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;
      const endMetadataUploadTime = performance.now();  // Befejezés
      const metadataUploadDuration = endMetadataUploadTime - startMetadataUploadTime;
      console.log(`IPFS metadata feltöltés időtartama: ${metadataUploadDuration} ms`);

    } catch (err) {
      console.error("Error uploading metadata: ", err);
      return;
    }

    try {
      await props.gemMining(gemType, price, metadataUrl, false, fileUrl); // On-chain csak az IPFS hash tárolása
    } catch (error) {
      console.error("Error in gemMining: ", error);
    }

    navigate('/loggedIn');
  };

  return ( 
  <div className="card-container card-background">
    <div className="form-card">
      <h1>Add Mined Gem</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input id="gemType" name="gemType" type="text" className="form-control" placeholder="Type" required />
        </div>
        <div className="form-group">
          <input id="price" name="price" type="text" className="form-control" placeholder="Price in Ether" required />
        </div>
        <div className="form-group">
          <input id="weight" name="weight" type="text" className="form-control" placeholder="Weight" required />
        </div>
        <div className="form-group">
          <input id="depth" name="depth" type="text" className="form-control" placeholder="Depth" required />
        </div>
        <div className="form-group">
          <input id="height" name="height" type="text" className="form-control" placeholder="Height" required />
        </div>
        <div className="form-group">
          <input id="width" name="width" type="text" className="form-control" placeholder="Width" required />
        </div>
        <div className="form-group">
          <input id="miningLocation" name="miningLocation" type="text" className="form-control" placeholder="Mining Location" required />
        </div>
        <div className="form-group">
          <input id="miningYear" name="miningYear" type="text" className="form-control" placeholder="Mining Year" required />
        </div>
        <div className="form-group">
          <input type="file" name="image" ref={fileInputRef} className="form-control" />
        </div>
        <button type="submit" name="addMinedGem" className="button">Add Mined Gem</button>
      </form>
    </div>
  </div>
  );
}

export default MinedGemForm;
