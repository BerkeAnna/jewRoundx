import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function GemSelectingForm(props) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Using ref for file input
  const { id } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Assuming the form fields are similar to MinedGemForm and included in the form
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

    // Here you can include additional logic to handle the form submission,
    // such as sending the data to your backend or blockchain.
    // Make sure to include the `fileUrl` if needed.
    
    // Example of accessing form data:
    // const gemType = formData.get('gemType');
    // You would then pass these values to your API or smart contract interaction logic.
    
    console.log("Form data: Size:", formData.get('size')); // Ellenőrizd, hogy ez nem null vagy üres string



    formData.append('fileUrl', fileUrl);

    console.log("file url:::::", fileUrl)

    const minedGemId = id; 
    const gemType = formData.get('gemType').toString();
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const size = formData.get('size').toString(); // Biztosítja, hogy a méret szövegként legyen átalakítva

    const carat = formData.get('carat');
    const color = formData.get('color').toString();
    const grinding = formData.get('grinding');
    console.log(minedGemId)
   // const minedGemId = 1
   if (!size) {
    console.error("Size is required.");
    return; // Megakadályozza a további végrehajtást, ha a méret nincs megadva
  }
  props.gemSelecting(minedGemId, size, carat, color, gemType, grinding, fileUrl, price);
    // After submission logic, you might want to navigate the user to another route or show a success message.
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
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mr-sm-2">
          <input id="size" name="size" type="text" className="form-control" placeholder="size" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="carat" name="carat" type="text" className="form-control" placeholder="carat" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="color" name="color" type="text" className="form-control" placeholder="color" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="gemType" name="gemType" type="text" className="form-control" placeholder="gemType" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="grinding" name="grinding" type="text" className="form-control" placeholder="grinding" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="price" name="price" type="text" className="form-control" placeholder="Price in Ether" required />
        </div>
        <div className="form-group mr-sm-2">
          <input type="file" ref={fileInputRef} className="form-control" />
        </div>
        <button type="submit" className="custom-button btn btn-primary">Add Product</button>
      </form>
    </div>
  );
}

export default GemSelectingForm;
