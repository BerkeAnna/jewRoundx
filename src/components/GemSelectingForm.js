import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function GemSelectingForm(props) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Using ref for file input
  const { id } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

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

    const color = formData.get('color').toString();
    const gemType = formData.get('gemType').toString();
    const colorGemType = `Color: ${color} Type: ${gemType}`; // Combine color and gem type
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const depth = formData.get('depth').toString();
    const height = formData.get('height').toString();
    const width = formData.get('width').toString();
    const size = `${depth}x${height}x${width} mm`; // Combine dimensions into a size string
    const carat = formData.get('carat').toString();

    if (!size) {
      console.error("Size is required.");
      return; // Prevent further execution if the size is not provided
    }

    const minedGemId = parseInt(id, 10);

    try {
      await props.gemSelecting(minedGemId, size, carat, colorGemType, fileUrl, price);
      navigate('/loggedIn');
    } catch (error) {
      console.error("Error in gemSelecting: ", error);
    }
  };

  return (
    <div className="card">
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
  );
}

export default GemSelectingForm;
