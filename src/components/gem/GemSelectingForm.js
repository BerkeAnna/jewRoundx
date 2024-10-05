import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function GemSelectingForm(props) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { id } = useParams();

  const handleMarkAsSelected = (gemId) => {
    props.markGemAsSelected(gemId); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    handleMarkAsSelected(id);
    const formData = new FormData(event.target);
    const file = fileInputRef.current.files[0];

    let fileUrl = "";
    if (file) {
      try {
        const fileData = new FormData();
        fileData.append("file", file);

        console.log("Uploading file to Pinata...");
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', fileData, {
          headers: {
            'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
            'pinata_secret_api_key': process.env.REACT_APP_PINATA_PRIVATE_KEY,
          },
        });

        if (response && response.data && response.data.IpfsHash) {
          fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
          console.log("File uploaded successfully to Pinata: ", fileUrl);
        } else {
          console.error('Pinata response error: ', response);
          return;
        }
      } catch (err) {
        console.error("Error uploading file: ", err);
        return;
      }
    }

    // A form mezők beállítása
    const color = formData.get('color').toString();
    const gemType = formData.get('gemType').toString();
    const polishing = formData.get('polishing').toString();
    const transparency = formData.get('transparency').toString();
    const treatments = formData.get('treatments').toString();
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const depth = formData.get('depth').toString();
    const height = formData.get('height').toString();
    const width = formData.get('width').toString();
    const size = `${depth}x${height}x${width} mm`;
    const carat = formData.get('carat').toString();

    const metadata = {
      gemType,
      color,
      polishing,
      transparency,
      treatments,
      size,
      carat,
      fileUrl
    };

    // Metaadatok feltöltése IPFS-re
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

    const minedGemId = parseInt(id, 10);

    try {
      console.log("Submitting gem selection...");
      await props.gemSelecting(minedGemId, metadataUrl, price);
      console.log("Gem selected successfully.");
      navigate('/loggedIn');
    } catch (error) {
      console.error("Error in gemSelecting: ", error);
    }
  };

  return (
    <div className="card-container card-background">
      <div className="form-card">
        <h1>Select Gem</h1>
        <form onSubmit={handleSubmit}>
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
            <input id="carat" name="carat" type="text" className="form-control" placeholder="Carat" required />
          </div>
          <div className="form-group">
            <input id="color" name="color" type="text" className="form-control" placeholder="Color" required />
          </div>
          <div className="form-group">
            <input id="polishing" name="polishing" type="text" className="form-control" placeholder="Polishing" required />
          </div>
          <div className="form-group">
            <input id="transparency" name="transparency" type="text" className="form-control" placeholder="Transparency" required />
          </div>
          <div className="form-group">
            <input id="treatments" name="treatments" type="text" className="form-control" placeholder="Treatments" required />
          </div>
          <div className="form-group">
            <input id="gemType" name="gemType" type="text" className="form-control" placeholder="Gem Type" required />
          </div>
          <div className="form-group">
            <input id="price" name="price" type="text" className="form-control" placeholder="Price in Ether" required />
          </div>
          <div className="form-group">
            <input type="file" ref={fileInputRef} className="form-control" />
          </div>
          <button type="submit" className="button">Select Gem</button>
        </form>
      </div>
    </div>
  );
}

export default GemSelectingForm;