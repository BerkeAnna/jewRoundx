import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Forms.css';

function JewelryForm(props) {
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

    const gemId = parseInt(id, 10);  // Ensure gemId is an integer
    const name = formData.get('name').toString();
    const metal = formData.get('metal').toString();
    const depth = formData.get('depth').toString();
    const height = formData.get('height').toString();
    const width = formData.get('width').toString();
    const size = `Depth: ${depth} mm - Height: ${height} mm - Width: ${width} mm`; // Combine dimensions into a size string
    const physicalDetails = `Metal: ${metal} - ${size}`; // Combine metal and size into one string TODO size???
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const sale = false;

    if (!name) {
      console.error("Name is required.");
      return; // Prevent further execution if the name is not provided
    }

    props.jewelryMaking(name, gemId, physicalDetails, sale, price, fileUrl);

    // After submission logic, you might want to navigate the user to another route or show a success message.
  };

  return (
    <div className="card-container">
      <div className="card">
        <h1>Add jewelry</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input id="name" name="name" type="text" className="form-control" placeholder="name" required />
          </div>
          <div className="form-group">
            <input id="price" name="price" type="text" className="form-control" placeholder="price" required />
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
            <input type="file" ref={fileInputRef} className="form-control" />
          </div>
          <button type="submit" className="button">Make jewelry</button>
        </form>
      </div>
    </div>
  );
}

export default JewelryForm;
