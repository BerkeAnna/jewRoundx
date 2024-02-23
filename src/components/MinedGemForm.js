import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Main(props) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Using ref for file input

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    let fileUrl = "";
    const file = fileInputRef.current.files[0]; // Access file directly from ref

    if (file) {
      try {
        const fileData = new FormData();
        fileData.append("file", file);

        const responseData = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: fileData,
          headers: {
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_PRIVATE_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        fileUrl = `https://coral-biological-monkey-396.mypinata.cloud/ipfs/${responseData.data.IpfsHash}`;
        console.log(fileUrl);
      } catch (err) {
        console.error(err);
        return; // Exit if there's an error
      }
    }

    const formData = new FormData(event.target);
    const gemType = formData.get('gemType');
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const weight = formData.get('weight'); // Assuming you meant 'weight' instead of 'width' as per your smart contract parameters
    const size = formData.get('size');
    const miningLocation = formData.get('miningLocation');
    const miningYear = formData.get('miningYear');

    // Make sure to adjust the props.gemMining call to match your smart contract's expected parameters
    props.gemMining(gemType, weight, size, price, miningLocation, miningYear, fileUrl, false);
  };

  return (
    <div id="content">
      <h1>Add Product</h1>
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
          <input id="size" name="size" type="text" className="form-control" placeholder="Size" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="miningLocation" name="miningLocation" type="text" className="form-control" placeholder="Mining Location" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="miningYear" name="miningYear" type="text" className="form-control" placeholder="Mining Year" required />
        </div>
        <div className="form-group mr-sm-2">
          <input
            type="file"
            ref={fileInputRef} // Use the ref here
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
}

export default Main;
