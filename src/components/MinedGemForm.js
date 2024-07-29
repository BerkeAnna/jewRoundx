import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MinedGemForm(props) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Using ref for file input

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(event.target);
    const file = fileInputRef.current.files[0];

    let fileUrl = "";
    if (file) {
      try {
        const fileData = new FormData();
        fileData.append("file", file);

        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', fileData, {
          headers: {
            'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
            'pinata_secret_api_key': process.env.REACT_APP_PINATA_PRIVATE_KEY,
          },
        });

        fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      } catch (err) {
        console.error("Error uploading file: ", err);
        return; // Exit if there's an error
      }
    }

    const gemType = formData.get('gemType').toString();
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const weight = formData.get('weight').toString();
    const depth = formData.get('depth').toString();
    const height = formData.get('height').toString();
    const width = formData.get('width').toString();
    const size = `${depth}x${height}x${width}`; // Combine dimensions into a size string
    const miningLocation = formData.get('miningLocation').toString();
    const miningYear = formData.get('miningYear').toString();

    try {
      // Wait for the MetaMask transaction to complete
      await props.gemMining(gemType, weight, size, price, miningLocation, miningYear, fileUrl, false);

      // After the transaction is confirmed, navigate to the desired page
    } catch (error) {
      console.error("Error in gemMining: ", error);
    }
    navigate('/loggedIn');
  };

  return (
    <div className="card" style={{ 
      marginBottom: '20px', 
      padding: '20px', 
      backgroundColor: '#FFF7F3', 
      width: '90%', 
      margin: 'auto', 
      textAlign: 'center', 
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
      marginTop: '60px' // Added marginTop for additional space
    }}>
      <h1>Add Mined Gem</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mr-sm-2">
          <input id="gemType" name="gemType" type="text" className="form-control" placeholder="Type" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="price" name="price" type="text" className="form-control" placeholder="Price in Ether" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="weight" name="weight" type="text" className="form-control" placeholder="Weight" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="depth" name="depth" type="text" className="form-control" placeholder="Depth" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="height" name="height" type="text" className="form-control" placeholder="Height" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="width" name="width" type="text" className="form-control" placeholder="Width" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="miningLocation" name="miningLocation" type="text" className="form-control" placeholder="Mining Location" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="miningYear" name="miningYear" type="text" className="form-control" placeholder="Mining Year" required />
        </div>
        <div className="form-group mr-sm-2">
          <input type="file" ref={fileInputRef} className="form-control" />
        </div>
        <button type="submit" className="custom-button btn btn-primary">Add Mined Gem</button>
      </form>
    </div>
  );
}

export default MinedGemForm;
